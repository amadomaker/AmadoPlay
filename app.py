from flask import Flask, request, jsonify
from gensim.models import KeyedVectors
from flask_cors import CORS
import os
import hashlib
import datetime
import re
import random
import numpy as np
import unicodedata
from threading import Lock, Thread

app = Flask(__name__)
CORS(app)

EMBEDDING_FILE = 'cc.pt.300.vec'
FASTTEXT_BIN_FILE = 'cc.pt.300.bin'  # opcional, se existir usamos subwords
USE_FASTTEXT_BIN = False
TOP_VOCAB = 200000
TOP_K_CLUSTER = 3000

SUFIXOS_DIMINUTIVOS = ('inho', 'inha', 'zinho', 'zinha', 'ito', 'ita')
SUFIXOS_AUMENTATIVOS = ('ão', 'ona', 'aço', 'aça')
# Sufixos verbais comuns em PT
SUFIXOS_FLEXOES = ('ando', 'endo', 'indo', 'ava', 'ava-se', 'asse', 'esse', 'isse', 'ou', 'ou-se',
                   'aram', 'ava-se', 'ando-se', 'ido', 'ado', 'ido-se', 'ado-se', 'ava', 'ei', 'ou', 'ou-se', 'ar', 'er', 'ir')

# Inicialização preguiçosa (lazy) do modelo e vocabulário
init_lock = Lock()
_initialized = False
wv = None
vocab_top = []
palavras_validas = []
indices_validos = None
palavras_sorteaveis = []

def initialize():
    global _initialized, wv, vocab_top, palavras_validas, indices_validos, palavras_sorteaveis
    if _initialized:
        return
    with init_lock:
        if _initialized:
            return
        print("Carregando modelo, aguarde...")
        use_ft = USE_FASTTEXT_BIN and os.path.exists(FASTTEXT_BIN_FILE)
        if use_ft:
            try:
                from gensim.models.fasttext import load_facebook_vectors
                wv_local = load_facebook_vectors(FASTTEXT_BIN_FILE)
                wv = wv_local
                print("FastText .bin carregado (subwords ON)")
            except Exception as e:
                print(f"Falha ao carregar FastText .bin: {e}. Caindo para .vec...")
                wv = KeyedVectors.load_word2vec_format(EMBEDDING_FILE, binary=False)
        else:
            wv = KeyedVectors.load_word2vec_format(EMBEDDING_FILE, binary=False)
        # Normalização pré-computada (se disponível)
        try:
            wv.fill_norms()
        except Exception:
            pass
        print("Modelo carregado!")

        # Limita o vocabulário jogável ao TOP_VOCAB mais frequente do embedding
        vocab_top = wv.index_to_key[:max(TOP_VOCAB, 10000)]
        palavras_validas = [
            w for w in vocab_top
            if is_palavra_valida(w) and w == singulariza(w)
        ]

        # Índices no embedding para o subconjunto jogável
        import numpy as _np
        indices_validos = _np.array([wv.key_to_index[w] for w in palavras_validas], dtype=_np.int64)
        print(f"Palavras jogáveis válidas (limitadas): {len(palavras_validas)}")

        # Filtrar diminutivos/aumentativos do pool de sorteio quando houver base clara
        base_vocab = set(palavras_validas)
        def elegivel_para_sorteio(token: str) -> bool:
            t = strip_accents(token)
            for suf in SUFIXOS_DIMINUTIVOS + SUFIXOS_AUMENTATIVOS:
                if t.endswith(suf):
                    base = t[:-len(suf)]
                    if len(base) >= 3 and base in base_vocab:
                        return False
            return True

        palavras_sorteaveis = [w for w in palavras_validas if elegivel_para_sorteio(w)]
        _initialized = True

def ensure_initialized():
    if not _initialized:
        initialize()

def is_palavra_valida(w):
    # Regras básicas para manter vocabulário legível, mas aceitando curtas como "fio" e "nó"
    if not (w.isalpha() and w.islower()):
        return False
    if len(w) < 2 or len(w) > 12:
        return False
    # Filtra tokens provavelmente estrangeiros (inglês) que poluem o ranking
    if any(ch in w for ch in 'wky'):
        return False
    # Não bloqueia mais diminutivos/aumentativos por sufixo para evitar falsos negativos (ex.: "lesão")
    if w.endswith('s') and len(w) > 4:
        if not w.endswith(('ais', 'éis', 'ois', 'uis')):
            return False
    if re.search(r'[^a-záéíóúâêîôûãõç]', w):
        return False
    return True

def strip_accents(s: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFD', s) if not unicodedata.combining(c))

def singulariza(w):
    if w.endswith('res') and len(w) > 5:
        return w[:-2]
    elif w.endswith('ns'):
        return w[:-2] + 'm'
    elif w.endswith('ões'):
        return w[:-3] + 'ão'
    elif w.endswith(('ais', 'éis', 'ois', 'uis')):
        return w
    elif w.endswith('es') and len(w) > 4:
        return w[:-2]
    elif w.endswith('s') and len(w) > 4:
        return w[:-1]
    else:
        return w

def radical(w):
    # Normaliza acentos para agrupar variantes (ex.: crochê ~ croche)
    w = strip_accents(w)
    # Base de vocabulário (se já inicializada) para evitar falsos agrupamentos
    try:
        base_vocab = set(palavras_validas) if palavras_validas else set()
    except NameError:
        base_vocab = set()

    # - advérbios em "-mente" (apenas se base existir)
    if w.endswith('mente') and len(w) > 7:
        base = w[:-5]
        if (not base_vocab) or (base in base_vocab):
            w = base

    # - sufixos profiss./coletivo: -eiro/-eira (normaliza para -eiro apenas se existir)
    if w.endswith('eira') and len(w) > 6:
        cand = w[:-1] + 'o'  # eira -> eiro
        if (not base_vocab) or (cand in base_vocab):
            w = cand

    # - normaliza gênero -o/-a apenas se a contraparte existir no vocabulário
    if len(w) > 3 and w.endswith('a'):
        cand = w[:-1] + 'o'
        if (not base_vocab) or (cand in base_vocab):
            w = cand

    # - diminutivos/aumentativos: remove somente se a base existir no vocabulário jogável
    if base_vocab:
        for suf in SUFIXOS_DIMINUTIVOS + SUFIXOS_AUMENTATIVOS:
            if w.endswith(suf):
                base = w[:-len(suf)]
                if len(base) >= 3 and base in base_vocab:
                    w = base
                    break

    # Remove sufixos verbais principais
    for suf in SUFIXOS_FLEXOES:
        if w.endswith(suf) and len(w) > len(suf)+2:
            return w[:-len(suf)]
    return w

def filtra_variacoes(lista):
    vistos = set()
    filtrados = []
    for w in lista:
        r = radical(w)
        if r not in vistos:
            vistos.add(r)
            filtrados.append(w)
    return filtrados

# Flask 3 removeu before_first_request; initialization é lazy dentro dos handlers
def get_palavra_secreta():
    # Palavra secreta diária, sempre a partir de palavras_sorteaveis (todas válidas no embedding)
    today = datetime.date.today().strftime("%Y-%m-%d")
    base = f"{today}|contexto-pt"
    idx = int(hashlib.sha256(base.encode()).hexdigest(), 16) % max(1, len(palavras_sorteaveis))
    return palavras_sorteaveis[idx]

def _get_vector(token: str):
    try:
        return wv.get_vector(token)
    except KeyError:
        return None

def _get_vector_with_fallback(token: str):
    v = _get_vector(token)
    if v is not None:
        return v
    t2 = strip_accents(token)
    if t2 != token:
        return _get_vector(t2)
    return None

def _l2_normalize(vec: np.ndarray) -> np.ndarray:
    n = float(np.linalg.norm(vec))
    if n == 0.0:
        return vec
    return vec / n

def calcular_ranking(palavra_secreta):
    ensure_initialized()
    # Similaridades vetorizadas apenas no subconjunto jogável (rápido)
    v = _get_vector_with_fallback(palavra_secreta)
    if v is None:
        return {'por_radical': {}, 'por_palavra': {}, 'cluster_indices': [], 'cluster_words': []}

    normed = wv.get_normed_vectors()
    vec = _l2_normalize(v)
    sims = normed[indices_validos] @ vec

    # Seleciona Top-K similares (cluster semântico)
    K = min(TOP_K_CLUSTER, len(palavras_validas) - 1 if len(palavras_validas) > 1 else 0)
    if K <= 0:
        return {'por_radical': {}, 'por_palavra': {}, 'cluster_indices': [], 'cluster_words': []}
    topk_idx_local = np.argpartition(-sims, K-1)[:K]
    topk_sorted = topk_idx_local[np.argsort(-sims[topk_idx_local])]

    pares = [(palavras_validas[i], float(sims[i])) for i in topk_sorted if palavras_validas[i] != palavra_secreta]

    # Remove ruído típico do embedding: verbos flexionados e estrangeirismos
    def _is_cluster_candidate(token: str) -> bool:
        t = strip_accents(token)
        if any(ch in t for ch in 'wky'):
            return False
        VERB_SUFFIXES = (
            'ando','endo','indo','ava','asse','esse','isse','ou','ei','aram','ava-se','ando-se','ou-se'
        )
        return not any(t.endswith(s) and len(t) > len(s)+1 for s in VERB_SUFFIXES)

    pares_filtrados = [(w, s) for (w, s) in pares if _is_cluster_candidate(w)]
    # Se o filtro removeu demais, usa o original para não perder cobertura
    if len(pares_filtrados) >= max(200, int(len(pares) * 0.5)):
        pares = pares_filtrados

    # Sem booster específico: ranking puramente pelo embedding no cluster

    # Define o rank por radical com base no cluster Top-K
    ranks_por_radical = {}
    rep_por_radical = {}
    pos = 1
    for w, _sim in pares:
        r = radical(w)
        if r not in ranks_por_radical:
            ranks_por_radical[r] = pos
            rep_por_radical[r] = w  # primeiro visto vira representante
            pos += 1

    # Mapeia apenas as palavras do cluster ao seu rank e à forma canônica
    ranks_por_palavra = {}
    canonical_por_palavra = {}
    cluster_words = [w for w, _ in pares]
    for w in cluster_words:
        r = radical(w)
        ranks_por_palavra[w] = ranks_por_radical[r]
        canonical_por_palavra[w] = rep_por_radical[r]

    cluster_indices = [int(indices_validos[i]) for i in topk_sorted]
    cluster_words_full = [palavras_validas[i] for i in topk_sorted]
    return {
        'por_radical': ranks_por_radical,
        'por_palavra': ranks_por_palavra,
        'rep_por_radical': rep_por_radical,
        'canonical_por_palavra': canonical_por_palavra,
        'cluster_indices': cluster_indices,
        'cluster_words': cluster_words_full,
    }

ranking_cache = {}
palavra_secreta_cache = {}

@app.route('/palavra_secreta', methods=['GET'])
def palavra_secreta():
    ensure_initialized()
    palavra = get_palavra_secreta()
    return jsonify({"palavra_secreta": palavra})

@app.route('/warmup', methods=['GET'])
def warmup():
    """Carrega o modelo e pré-calcula o ranking da palavra do dia.
    Útil para aquecer o servidor após subir, sem depender de outra rota."""
    ensure_initialized()
    secret = get_palavra_secreta()
    # Recalcula cache se necessário
    cached_secret = palavra_secreta_cache.get('secreta')
    if cached_secret != secret or ranking_cache.get('ranks') is None:
        ranks = calcular_ranking(secret)
        palavra_secreta_cache['secreta'] = secret
        ranking_cache['ranks'] = ranks
    return jsonify({
        'ok': True,
        'palavra_secreta': secret,
        'palavras_validas': len(palavras_validas) if palavras_validas else 0,
    })

def _aproxima_rank_por_vizinho(token_para_vetor: str, ranks):
    """Aproxima rank via vizinho mais próximo dentro do cluster Top-K."""
    if not token_para_vetor:
        return None
    v = _get_vector_with_fallback(token_para_vetor)
    if v is None:
        return None
    normed = wv.get_normed_vectors()
    vec = _l2_normalize(v)
    cluster_indices = ranks.get('cluster_indices') or []
    if not cluster_indices:
        return None
    sims = normed[cluster_indices] @ vec
    nn_idx = int(np.argmax(sims))
    cluster_words = ranks.get('cluster_words', [])
    if not cluster_words:
        return None
    palavra_nn = cluster_words[nn_idx]
    r = radical(palavra_nn)
    rank = ranks.get('por_radical', {}).get(r)
    rep = (ranks.get('rep_por_radical') or {}).get(r)
    return (rank, rep)

@app.route('/tentativa', methods=['POST', 'OPTIONS'])
def tentativa():
    if request.method == 'OPTIONS':
        return ('', 200)
    ensure_initialized()
    data = request.get_json()
    palpite = data.get('palavra', '').strip().lower()
    palpite_sing = singulariza(palpite)
    r_palpite = radical(palpite_sing)

    # Validação leve: permanece o filtro, mas aceitamos curtas. Não exigimos presença direta no embedding aqui,
    # pois o ranqueamento será por radical (o grupo representativo pode existir sem a forma exata).
    if not is_palavra_valida(palpite_sing):
        return jsonify({"erro": "Palavra não permitida no contexto do jogo."})

    palavra_secreta = palavra_secreta_cache.get('secreta')
    ranks = ranking_cache.get('ranks')
    current_secret = get_palavra_secreta()
    if palavra_secreta is None or ranks is None or palavra_secreta != current_secret:
        palavra_secreta = current_secret
        ranks = calcular_ranking(palavra_secreta)
        palavra_secreta_cache['secreta'] = palavra_secreta
        ranking_cache['ranks'] = ranks

    ranks_por_radical = ranks.get('por_radical', {})
    ranks_por_palavra = ranks.get('por_palavra', {})
    rep_por_radical = ranks.get('rep_por_radical', {})
    reps = set(rep_por_radical.values()) if rep_por_radical else set(ranks_por_palavra.keys())
    rep_por_radical = ranks.get('rep_por_radical', {})
    reps = set(rep_por_radical.values()) if rep_por_radical else set(ranks_por_palavra.keys())
    rep_por_radical = ranks.get('rep_por_radical', {})
    reps = set(rep_por_radical.values()) if rep_por_radical else set(ranks_por_palavra.keys())
    rep_por_radical = ranks.get('rep_por_radical', {})
    secret_fold = strip_accents(palavra_secreta)

    # Conferimos se o palpite tem grupo conhecido. Se não houver, ainda assim tente fallback via presença direta no embedding.
    grupo_existe = (r_palpite in ranks_por_radical) or (palpite_sing in ranks_por_palavra)

    # Fallback para tokens fora do vocabulário jogável: tenta sem acentos
    token_para_vetor = None
    if palpite_sing in wv.key_to_index:
        token_para_vetor = palpite_sing
    else:
        palpite_fold = strip_accents(palpite_sing)
        if palpite_fold in wv.key_to_index:
            token_para_vetor = palpite_fold

    if not grupo_existe and token_para_vetor is None:
        return jsonify({"erro": "Palavra não encontrada no vocabulário do jogo."})

    acertou = (palpite_sing == palavra_secreta)
    canonical = palpite_sing
    if acertou:
        rank = 0
        canonical = palpite_sing
    else:
        # Primeiro tenta por palavra (caso ela tenha sido mapeada);
        # caso contrário usa o rank do radical (grupo) para evitar -1.
        rank = ranks_por_palavra.get(palpite_sing)
        if rank is None:
            rank = ranks_por_radical.get(r_palpite)
        # Define forma canônica para unificar variações
        if r_palpite in rep_por_radical:
            canonical = rep_por_radical[r_palpite]
        else:
            canonical = palpite_sing

    # Se ainda não temos rank (palavra/grupo desconhecido), aproxima pelo vizinho conhecido
    if not acertou and (rank is None):
        approx = _aproxima_rank_por_vizinho(token_para_vetor, ranks)
        if isinstance(approx, tuple):
            rank, canonical_from_nn = approx
            if canonical_from_nn:
                canonical = canonical_from_nn
        else:
            rank = approx
    if rank is None:
        return jsonify({"erro": "Palavra não encontrada no vocabulário do jogo."})

    return jsonify({
        "acertou": acertou,
        "rank": rank,
        "palavra": palpite_sing,
        "canonical": canonical
    })

@app.route('/dica', methods=['POST', 'OPTIONS'])
def dica():
    if request.method == 'OPTIONS':
        return ('', 200)
    # Calcula e devolve uma palavra com rank melhor que o melhor atual (afunilando até rank 2)
    ensure_initialized()
    data = request.get_json(force=True) or {}
    melhor_rank = data.get('melhor_rank')
    ja_tentadas = set((data.get('ja_tentadas') or []))

    # Garante ranking e palavra secreta carregados
    palavra_secreta = palavra_secreta_cache.get('secreta')
    ranks = ranking_cache.get('ranks')
    current_secret = get_palavra_secreta()
    if palavra_secreta is None or ranks is None or palavra_secreta != current_secret:
        palavra_secreta = current_secret
        ranks = calcular_ranking(palavra_secreta)
        palavra_secreta_cache['secreta'] = palavra_secreta
        ranking_cache['ranks'] = ranks

    ranks_por_palavra = ranks.get('por_palavra', {})

    # Se não houver melhor_rank informado, assume grande para começar a afunilar
    if not isinstance(melhor_rank, int) or melhor_rank <= 0:
        melhor_rank = max(ranks_por_palavra.values()) if ranks_por_palavra else 999999

    # Janela de afunilamento mais agressiva: [melhor-20, melhor-1], mínimo 2
    low = max(2, int(melhor_rank) - 20)
    high = max(2, int(melhor_rank) - 1)
    if low > high:
        low, high = 2, max(2, int(melhor_rank) - 1)

    # Conjunto candidato: rank no intervalo, não tentadas, e não repetir palavra secreta
    secret_fold = strip_accents(palavra_secreta)
    def _not_prefix_of_secret(token: str) -> bool:
        wf = strip_accents(token)
        # Evita dicas que sejam prefixo óbvio da secreta ou vice‑versa (ex.: "preju" para "prejuizo")
        return not (secret_fold.startswith(wf) or wf.startswith(secret_fold))

    candidatos = [w for w in reps
                  if low <= ranks_por_palavra.get(w, 10**9) <= high and w not in ja_tentadas and w != palavra_secreta and _not_prefix_of_secret(w)]

    # Se vazio, relaxa para qualquer rank melhor que o atual (>=2)
    if not candidatos:
        candidatos = [w for w in reps
                      if 2 <= ranks_por_palavra.get(w, 10**9) < melhor_rank and w not in ja_tentadas and w != palavra_secreta and _not_prefix_of_secret(w)]

    if not candidatos:
        return jsonify({"erro": "Sem mais dicas disponíveis."}), 200

    palavra = random.choice(candidatos)
    rank = ranks_por_palavra.get(palavra)

    return jsonify({
        "palavra": palavra,
        "canonical": palavra,
        "rank": rank
    })

if __name__ == '__main__':
    # Com lazy init acima, podemos reativar o reloader sem
    # carregar o embedding duas vezes na importação do módulo.
    app.run(debug=True, use_reloader=True)

# Warm-up automático opcional em background (produção/dev)
def _background_warmup():
    try:
        ensure_initialized()
        secret = get_palavra_secreta()
        # Prepara ranking e cache
        ranks = calcular_ranking(secret)
        palavra_secreta_cache['secreta'] = secret
        ranking_cache['ranks'] = ranks
        print("Warmup concluído.")
    except Exception as e:
        print(f"Warmup falhou: {e}")

if os.getenv('AUTO_WARMUP', '1') == '1':
    try:
        Thread(target=_background_warmup, daemon=True).start()
        print("Warmup em background iniciado (AUTO_WARMUP=1)")
    except Exception as _e:
        print(f"Não foi possível iniciar warmup em background: {_e}")
