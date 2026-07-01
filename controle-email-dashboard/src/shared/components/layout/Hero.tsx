interface StatsCardProps {
  label: string
  value: number
  highlighted?: boolean
  valueColor?: string
}

function StatsCard({ label, value, highlighted, valueColor }: StatsCardProps) {
  return (
    <div
      className={`
        rounded-xl px-4 py-4 min-w-[250px] text-start
        ${highlighted
          ? 'bg-[#E8F0E8] border border-[#C5D9C5]'
          : 'bg-white border border-gray-200'
        }
      `}
    >
      <p className="text-xs font-semibold tracking-widest text-gray-500 uppercase mb-2">
        {label}
      </p>
      <p
        className={`text-3xl font-bold ${valueColor ?? 'text-gray-900'}`}
      >
        {value}
      </p>
    </div>
  )
}

interface DashboardStatsProps {
  solicitantes: number | undefined
  ocsEnviadas: number | undefined
  comErro: number | undefined
}

export default function Hero({
  solicitantes,
  ocsEnviadas,
  comErro,
}: DashboardStatsProps) {
  return (
    <section className=" px-8 py-8">
      <h2 className="text-start text-2xl font-bold text-gray-900 mb-1">OCs pendentes</h2>
      <p className="text-start text-sm text-[#9A7B6A] mb-6">
        Acompanhe o status de envio das Ordens de Compra por solicitante
      </p>

      <div className="mt-6 flex gap-4">
        <StatsCard
          label="Solicitantes"
          value={solicitantes || 0}
        />
        <StatsCard
          label="OCs enviadas"
          value={ocsEnviadas || 0}
          highlighted
          valueColor="text-[#3A7A3A]"
        />
        <StatsCard
          label="Com erro"
          value={comErro || 0}
          valueColor="text-[#A33A3A]"
        />
      </div>
    </section>
  )
}