// components/OcTable.tsx
import { useEffect, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Send,
  Search,
  Calendar,
  ChevronDown as SelectIcon,
} from "lucide-react";
import axios from "axios";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OC {
  CD_ORDEM_COMPRA: string;
  CD_SOLICITACAO: number;
  CONTROLE_OC: string;
  STATUS: string;
  ERRO_MSG: string;
  TENTATIVAS_ENVIO: number;
  DT_ENVIO_EMAIL: string;
  DT_CRIACAO_OC: string;
}

interface Grupo {
  EMAIL: string;
  NOME_APROVADOR: string;
  NOME_SOLICITANTE: string;
  OCS: OC[];
}

// ─── Badge ───────────────────────────────────────────────────────────────────

const badgeConfig: Record<string, { label: string; className: string }> = {
  ENVIADO: {
    label: "Enviado",
    className: "bg-[#E8F5E8] text-[#2E7D32] border border-[#C5E1C5]",
  },
  REENVIADO: {
    label: "Reenviado",
    className: "bg-[#E8F0F5] text-[#1565C0] border border-[#B3CDE0]",
  },
  PARCIAL: {
    label: "Parcial",
    className: "bg-[#F3E8FF] text-[#7B1FA2] border border-[#D9B3F0]",
  },
  PENDENTE: {
    label: "Pendente",
    className: "bg-[#FFF8E1] text-[#F57F17] border border-[#FFE082]",
  },
  ERRO: {
    label: "Erro",
    className: "bg-[#FFEBEE] text-[#C62828] border border-[#FFCDD2]",
  },
};

function Badge({ status }: { status: string }) {
  const cfg = badgeConfig[status] ?? badgeConfig.pendente;
  return (
    <span
      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ iniciais }: { iniciais: string }) {
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#D6E8D6] text-[#3A7A3A] text-xs font-bold shrink-0">
      {iniciais}
    </span>
  );
}

const POR_PAGINA = 5;

// ─── Linha de grupo ──────────────────────────────────────────────────────────

function GrupoRow({
  grupo,
  expanded,
  onToggle,
  onReenviar,
}: {
  grupo: Grupo;
  expanded: boolean;
  onToggle: () => void;
  onReenviar: (g: Grupo) => void;
}) {
  const [selecionadas, setSelecionadas] = useState<Set<string>>(new Set());

  function toggleOC(nr: string) {
    setSelecionadas((prev) => {
      const next = new Set(prev);
      next.has(nr) ? next.delete(nr) : next.add(nr);
      return next;
    });
  }

  function toggleTodas() {
    setSelecionadas((prev) =>
      prev.size === grupo.OCS?.length
        ? new Set()
        : new Set(grupo.OCS.map((o) => o.CD_ORDEM_COMPRA)),
    );
  }

  const todasSelecionadas = selecionadas.size === grupo.OCS?.length;

  return (
    <>
      {/* Linha principal do grupo */}
      <tr
        className="border-b border-gray-100 hover:bg-[#F9F7F3] cursor-pointer transition-colors"
        onClick={onToggle}
      >
        <td className="pl-4 pr-2 py-4 w-8">
          {expanded ? (
            <ChevronDown size={16} className="text-gray-400" />
          ) : (
            <ChevronRight size={16} className="text-gray-400" />
          )}
        </td>
        <td className="py-4 pr-4">
          <div className="flex items-center gap-3">
            <Avatar iniciais={grupo.NOME_SOLICITANTE?.substring(0, 2)} />
            <span className="font-semibold text-gray-900 text-sm">
              {grupo.NOME_SOLICITANTE}
            </span>
          </div>
        </td>
        <td className="py-4 pr-4 text-sm text-gray-500">{grupo.EMAIL}</td>
        <td className="py-4 pr-4 text-sm font-semibold text-gray-900">
          {grupo.OCS?.length}
        </td>
        {/* <td className="py-4 pr-4"><Badge status={grupo.status} /></td>
        <td className="py-4 pr-4 text-sm text-gray-500">{grupo.ultimo_envio}</td> */}
        <td className="py-4 pr-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReenviar(grupo);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2E7D32] border border-[#C5E1C5] rounded-full bg-[#F5FAF5] hover:bg-[#E8F5E8] transition-colors"
          >
            <Send size={12} />
            Reenviar
          </button>
        </td>
      </tr>

      {/* Linhas filhas — OCs */}
      {expanded && (
        <>
          {/* Cabeçalho das filhas */}
          <tr className="bg-[#F5F2EC]">
            <td className="pl-4" />
            <td colSpan={6} className="py-2 pr-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={todasSelecionadas}
                  onChange={toggleTodas}
                  className="accent-[#3A7A3A] w-3.5 h-3.5 rounded"
                />
                <span className="text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                  Selecionar todas as OCs
                </span>
              </label>
            </td>
          </tr>

          {grupo.OCS?.map((oc) => (
            <tr
              key={oc.CD_ORDEM_COMPRA}
              className="bg-[#FAFAF8] border-b border-gray-100 hover:bg-[#F5F2EC] transition-colors"
            >
              <td className="pl-4" />
              <td className="py-3 pr-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selecionadas.has(oc.CD_ORDEM_COMPRA)}
                    onChange={() => toggleOC(oc.CD_ORDEM_COMPRA)}
                    className="accent-[#3A7A3A] w-3.5 h-3.5 rounded"
                    // style={{ accentColor: '#3A7A3A' }}
                    // className="w-3.5 h-3.5 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    OC {oc.CD_ORDEM_COMPRA}
                  </span>
                </label>
              </td>
              <td className="py-3 pr-4 text-sm text-gray-400">
                SC {oc.CD_SOLICITACAO} · Controle {oc.CONTROLE_OC}
              </td>
              <td />
              <td className="py-3 pr-4">
                <Badge status={oc.STATUS} />
              </td>
              <td className="py-3 pr-4 text-sm text-gray-400">
                {oc.DT_ENVIO_EMAIL}
              </td>
              <td />
            </tr>
          ))}
        </>
      )}
    </>
  );
}

// ─── Paginação ───────────────────────────────────────────────────────────────

function Paginacao({
  pagina,
  total,
  porPagina,
  onChange,
}: {
  pagina: number;
  total: number;
  porPagina: number;
  onChange: (p: number) => void;
}) {
  const totalPaginas = Math.ceil(total / porPagina);
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <button
        disabled={pagina === 1}
        onClick={() => onChange(pagina - 1)}
        className="px-3 py-1 text-sm rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`w-8 h-8 text-sm rounded-md font-medium transition-colors ${
            p === pagina
              ? "bg-[#3A7A3A] text-white"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        disabled={pagina === totalPaginas}
        onClick={() => onChange(pagina + 1)}
        className="px-3 py-1 text-sm rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function OcTable({
  onReenviar,
}: {
  onReenviar: (g: Grupo) => void;
}) {
  const [emailsOc, setEmailsOc] = useState<Grupo[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/consultas")
      .then((res) => {
        setEmailsOc(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar emails de OC:", err);
      });
  }, []);

  const [expandidos, setExpandidos] = useState<Set<number>>(new Set([0]));
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [data, setData] = useState("");

  const filtrados = emailsOc.filter((g) => {
    // Filtro por busca (nome do solicitante ou número da OC)
    const buscaOk =
      busca === "" ||
      g.NOME_SOLICITANTE?.toLowerCase().includes(busca.toLowerCase()) ||
      g.OCS?.some((o) => o.CD_ORDEM_COMPRA?.toString().includes(busca));

    // Filtro por status — compara com o status de cada OC do grupo
    const statusOk =
      statusFiltro === "todos" ||
      g.OCS?.some(
        (o) => o.STATUS?.toUpperCase() === statusFiltro.toUpperCase(),
      );

    // Filtro por data — compara com a data de criação de cada OC do grupo
    const dataOk =
      data === "" ||
      g.OCS?.some((o) => {
        if (!o.DT_CRIACAO_OC) return false;
        const dtOC = new Date(o.DT_CRIACAO_OC).toISOString().split("T")[0];
        return dtOC === data;
      });

    return buscaOk && statusOk && dataOk;
  });

  const paginados = filtrados.slice(
    (pagina - 1) * POR_PAGINA,
    pagina * POR_PAGINA,
  );
  console.log(paginados)

  const agora =
    new Date().toLocaleDateString("pt-BR") +
    " " +
    new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

  function toggleExpandido(i: number) {
    setExpandidos((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  return (
    <div className="px-8 pb-8">
      {/* Filtros */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 cursor-pointer">
          <Calendar size={14} className="text-gray-400" />
          <input
            type="date"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
              setPagina(1);
            }}
            className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer"
            />
        </label>

        <div className="relative flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600">
          <select
            value={statusFiltro}
            onChange={(e) => {
              setStatusFiltro(e.target.value);
              setPagina(1);
            }}
            className="appearance-none bg-transparent outline-none pr-5 cursor-pointer text-gray-700"
          >
            <option value="todos">Todos os status</option>
            <option value="enviado">ENVIADO</option>
            <option value="parcial">PARCIAL</option>
            <option value="pendente">PENDENTE</option>
            <option value="erro">ERRO</option>
          </select>
          <SelectIcon
            size={14}
            className="absolute right-3 text-gray-400 pointer-events-none"
          />
        </div>

        <label className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-600 flex-1 min-w-[200px]">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar solicitante ou OC..."
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            className="bg-transparent outline-none w-full text-gray-700 placeholder:text-gray-400"
          />
        </label>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-8" />
              <th className="py-3 pr-4 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Solicitante
              </th>
              <th className="py-3 pr-4 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                E-mail
              </th>
              <th className="py-3 pr-4 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                OCs
              </th>
              {/* <th className="py-3 pr-4 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">Status</th>
              <th className="py-3 pr-4 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">Último envio</th> */}
              <th className="py-3 pr-6 text-left text-[11px] font-semibold tracking-widest text-gray-400 uppercase">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            {paginados.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  Nenhum resultado encontrado.
                </td>
              </tr>
            ) : (
              paginados.map((grupo, i) => {
                const idxReal = (pagina - 1) * POR_PAGINA + i;
                return (
                  <GrupoRow
                    key={idxReal}
                    grupo={grupo}
                    expanded={expandidos.has(idxReal)}
                    onToggle={() => toggleExpandido(idxReal)}
                    onReenviar={onReenviar}
                  />
                );
              })
            )}
          </tbody>
        </table>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col items-center gap-3">
          <Paginacao
            pagina={pagina}
            total={filtrados.length}
            porPagina={POR_PAGINA}
            onChange={setPagina}
          />
          <p className="text-xs text-[#8B7355]">
            Mostrando {filtrados.length} de {emailsOc?.length} solicitantes ·
            Última atualização: {agora}
          </p>
        </div>
      </div>
    </div>
  );
}
