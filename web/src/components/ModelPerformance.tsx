import { Info } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ABLATION_PAIRS, RECORDED_BENCHMARKS } from '../data/researchData';

type ChartMode = 'ablation' | 'progression';

export function ModelPerformance() {
  const [chartMode, setChartMode] = useState<ChartMode>('ablation');

  const progressionData = RECORDED_BENCHMARKS.map((item) => ({
    label: `${item.experimentCode} ${
      item.modality === 'Tabular'
        ? 'Tab'
        : item.modality === 'Multimodal'
          ? 'Multi'
          : item.protocol
    }`,
    fullLabel: `${item.experimentCode} · ${item.modelName} (${item.modality})`,
    mcrmse: item.mcrmse,
    protocol: item.protocol,
    id: item.id,
  }));

  return (
    <section
      id="research"
      className="border-b border-[#DCE0D8] bg-[#F7F7F3] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs tracking-wider text-[#147D80]">
              04 · MODEL PERFORMANCE &amp; VALIDATION
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[#101D2B] [text-wrap:balance] sm:text-4xl">
              Recorded Validation Results Across Modalities
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#475569]">
              Models are evaluated using Mean Columnwise Root Mean Squared Error
              (MCRMSE), where{' '}
              <strong className="font-semibold text-[#101D2B]">
                lower MCRMSE is better
              </strong>
              . Incorporating 67 Sentinel-2 features improves validation error over
              tabular-only baselines for both ExtraTrees and CatBoost.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-[#DCE0D8] bg-white px-4 py-3 text-xs leading-relaxed text-[#475569] lg:max-w-md">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#648CA6]" />
            <span>
              <strong className="font-semibold text-[#101D2B]">
                Validation Boundaries:
              </strong>{' '}
              These are internal validation results—not Kaggle leaderboard scores.
              Exp08 is exploratory and optimistic (blend weights selected and evaluated
              on the same OOF predictions). Exp09 uses a separate site-level holdout
              and is not directly comparable to Exp08.
            </span>
          </div>
        </div>

        {/* Recorded Summary Cards (Exp01, Exp02, Exp06, Exp07, Exp08, Exp09) */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-[#DCE0D8] bg-white p-5">
            <p className="font-mono text-xs text-[#648CA6]">
              Exp 01 &amp; Exp 06 · ExtraTrees (OOF)
            </p>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-semibold text-[#101D2B] tabular-nums">
                0.95105
              </span>
              <span className="font-mono text-xs text-[#526071] tabular-nums">
                vs 0.95581 tabular
              </span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-[#147D80] tabular-nums">
              -0.00476 MCRMSE multimodal gain
            </p>
          </div>

          <div className="rounded-xl border border-[#DCE0D8] bg-white p-5">
            <p className="font-mono text-xs text-[#147D80]">
              Exp 02 &amp; Exp 07 · CatBoost (OOF)
            </p>
            <div className="mt-2 flex items-baseline gap-2.5">
              <span className="font-mono text-2xl font-semibold text-[#101D2B] tabular-nums">
                0.93078
              </span>
              <span className="font-mono text-xs text-[#526071] tabular-nums">
                vs 0.95143 tabular
              </span>
            </div>
            <p className="mt-1.5 font-mono text-xs text-[#147D80] tabular-nums">
              -0.02065 MCRMSE multimodal gain
            </p>
          </div>

          <div className="rounded-xl border border-[#DCE0D8] bg-white p-5 sm:col-span-2 lg:col-span-1">
            <p className="font-mono text-xs text-[#B45309]">
              Exp 08 (OOF Blend) &amp; Exp 09 (Holdout)
            </p>
            <div className="mt-2 flex items-baseline gap-3">
              <div>
                <span className="font-mono text-2xl font-semibold text-[#101D2B] tabular-nums">
                  0.92399
                </span>
                <span className="ml-1.5 font-mono text-[11px] text-[#B45309]">
                  Exp08 OOF*
                </span>
              </div>
              <span aria-hidden="true" className="text-[#CBD5E1]">
                /
              </span>
              <div>
                <span className="font-mono text-2xl font-semibold text-[#9E3B3B] tabular-nums">
                  0.86305
                </span>
                <span className="ml-1.5 font-mono text-[11px] text-[#9E3B3B]">
                  Exp09 Holdout†
                </span>
              </div>
            </div>
            <p className="mt-1.5 text-[11px] text-[#526071]">
              *Optimistic in-OOF blend · †Separate holdout split (not directly comparable)
            </p>
          </div>
        </div>

        {/* Interactive Chart + Recorded Validation Ledger */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Chart Panel */}
          <div className="min-w-0 rounded-xl border border-[#DCE0D8] bg-white p-6 lg:col-span-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E7E9E2] pb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#101D2B]">
                  MCRMSE Comparison (Lower is Better)
                </h3>
                <p className="mt-0.5 text-xs text-[#526071]">
                  {chartMode === 'ablation'
                    ? 'Paired tabular (Exp01/02) vs multimodal (Exp06/07) OOF CV'
                    : 'All six recorded validation runs across OOF and separate holdout'}
                </p>
              </div>

              <div
                role="group"
                aria-label="Chart view toggle"
                className="flex items-center gap-1 rounded-md border border-[#DCE0D8] bg-[#F7F7F3] p-1"
              >
                <button
                  type="button"
                  aria-pressed={chartMode === 'ablation'}
                  onClick={() => setChartMode('ablation')}
                  className={`min-h-[36px] rounded px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                    chartMode === 'ablation'
                      ? 'bg-[#147D80] text-white font-semibold'
                      : 'text-[#475569] hover:text-[#101D2B]'
                  }`}
                >
                  Ablation Pairs
                </button>
                <button
                  type="button"
                  aria-pressed={chartMode === 'progression'}
                  onClick={() => setChartMode('progression')}
                  className={`min-h-[36px] rounded px-3 py-1 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#147D80] ${
                    chartMode === 'progression'
                      ? 'bg-[#147D80] text-white font-semibold'
                      : 'text-[#475569] hover:text-[#101D2B]'
                  }`}
                >
                  All Recorded Runs
                </button>
              </div>
            </div>

            <div className="mt-6 h-72 w-full">
              {chartMode === 'ablation' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ABLATION_PAIRS}
                    margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                  >
                    <CartesianGrid
                      stroke="#E7E9E2"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="family"
                      tick={{ fill: '#334155', fontSize: 12 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0.88, 0.97]}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => v.toFixed(2)}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(20, 125, 128, 0.06)' }}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE0D8',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#101D2B',
                      }}
                      formatter={(value: unknown, name: unknown) => [
                        Number(value).toFixed(5),
                        String(name),
                      ]}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="tabular"
                      name="Tabular Only (Exp 01 / 02)"
                      fill="#648CA6"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="multimodal"
                      name="Multimodal (Exp 06 / 07)"
                      fill="#147D80"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={progressionData}
                    margin={{ top: 10, right: 16, left: 0, bottom: 18 }}
                  >
                    <CartesianGrid
                      stroke="#E7E9E2"
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: '#334155', fontSize: 10 }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      tickLine={false}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                    />
                    <YAxis
                      domain={[0.8, 0.98]}
                      tick={{ fill: '#64748B', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => v.toFixed(2)}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(20, 125, 128, 0.06)' }}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#DCE0D8',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#101D2B',
                      }}
                      formatter={(value: unknown) => [
                        Number(value).toFixed(5),
                        'MCRMSE',
                      ]}
                      labelFormatter={(_label, payload) => {
                        const row = payload?.[0]?.payload as
                          | { fullLabel?: string; protocol?: string }
                          | undefined;
                        return row
                          ? `${row.fullLabel} [${row.protocol}]`
                          : '';
                      }}
                    />
                    <Bar dataKey="mcrmse" radius={[4, 4, 0, 0]}>
                      {progressionData.map((entry) => (
                        <Cell
                          key={entry.id}
                          fill={
                            entry.protocol === 'Holdout'
                              ? '#9E3B3B'
                              : entry.id === 'exp08-blend'
                                ? '#B45309'
                                : entry.label.includes('Multi')
                                  ? '#147D80'
                                  : '#648CA6'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[#E7E9E2] pt-3 text-xs text-[#526071]">
              <span className="text-[#648CA6] font-medium">Blue: Tabular OOF</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#147D80] font-medium">Teal: Multimodal OOF</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#B45309] font-medium">
                Amber: Exploratory Blend (Exp08)
              </span>
              <span aria-hidden="true">·</span>
              <span className="text-[#9E3B3B] font-medium">
                Muted Red: Separate Holdout (Exp09)
              </span>
            </div>
          </div>

          {/* Recorded Validation Ledger */}
          <div className="min-w-0 rounded-xl border border-[#DCE0D8] bg-white p-6 lg:col-span-6">
            <div className="border-b border-[#E7E9E2] pb-4">
              <h3 className="text-sm font-semibold text-[#101D2B]">
                Recorded Validation Ledger
              </h3>
              <p className="mt-0.5 text-xs text-[#526071]">
                Exact internal validation MCRMSE values (not Kaggle leaderboard scores)
              </p>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#DCE0D8] text-[#526071]">
                    <th className="py-2.5 pr-3 font-medium">Exp</th>
                    <th className="py-2.5 pr-3 font-medium">Model &amp; Context</th>
                    <th className="py-2.5 pr-3 font-medium">Split</th>
                    <th className="py-2.5 text-right font-medium">MCRMSE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E9E2]">
                  {RECORDED_BENCHMARKS.map((row) => (
                    <tr key={row.id} className="align-top">
                      <td className="py-3 pr-3 font-mono text-[#526071] whitespace-nowrap">
                        {row.experimentCode}
                      </td>
                      <td className="py-3 pr-3">
                        <p className="font-medium text-[#101D2B]">
                          {row.modelName} · {row.modality}
                        </p>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-[#526071]">
                          {row.notes}
                        </p>
                      </td>
                      <td className="py-3 pr-3 font-mono whitespace-nowrap">
                        <span
                          className={
                            row.protocol === 'Holdout'
                              ? 'text-[#9E3B3B]'
                              : row.id === 'exp08-blend'
                                ? 'text-[#B45309]'
                                : 'text-[#147D80]'
                          }
                        >
                          {row.caveat}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-sm font-semibold text-[#101D2B] tabular-nums whitespace-nowrap">
                        {row.mcrmse.toFixed(5)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
