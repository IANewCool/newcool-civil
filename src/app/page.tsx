'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'inicio' | 'intereses' | 'plazos' | 'costas' | 'recursos';

// Tasa de interes corriente vigente (aproximada - se actualiza mensualmente por CMF)
const TASA_INTERES_CORRIENTE = 2.33; // % mensual (Nov 2024)
const TASA_MAXIMA_CONVENCIONAL = TASA_INTERES_CORRIENTE * 1.5;

function InteresesCalculator() {
  const [monto, setMonto] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');
  const [tipoInteres, setTipoInteres] = useState<'corriente' | 'maximo' | 'personalizado'>('corriente');
  const [tasaPersonalizada, setTasaPersonalizada] = useState<string>('');
  const [resultado, setResultado] = useState<{
    diasTranscurridos: number;
    mesesTranscurridos: number;
    tasaAplicada: number;
    interesTotal: number;
    montoFinal: number;
  } | null>(null);

  const calcularIntereses = () => {
    if (!monto || !fechaInicio || !fechaFin) return;

    const montoNum = parseFloat(monto);
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    const diffTime = fin.getTime() - inicio.getTime();
    const diasTranscurridos = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const mesesTranscurridos = diasTranscurridos / 30;

    let tasaMensual: number;
    if (tipoInteres === 'corriente') {
      tasaMensual = TASA_INTERES_CORRIENTE;
    } else if (tipoInteres === 'maximo') {
      tasaMensual = TASA_MAXIMA_CONVENCIONAL;
    } else {
      tasaMensual = parseFloat(tasaPersonalizada) || 0;
    }

    const tasaDecimal = tasaMensual / 100;
    const interesTotal = montoNum * tasaDecimal * mesesTranscurridos;
    const montoFinal = montoNum + interesTotal;

    setResultado({
      diasTranscurridos,
      mesesTranscurridos: Math.round(mesesTranscurridos * 100) / 100,
      tasaAplicada: tasaMensual,
      interesTotal: Math.round(interesTotal),
      montoFinal: Math.round(montoFinal),
    });
  };

  const formatCLP = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <h2 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-2">
        <span>📊</span> Calculadora de Intereses
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Monto Capital ($)</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="1000000"
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fecha Inicio Deuda</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Fecha Calculo</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Tipo de Interes</label>
            <select
              value={tipoInteres}
              onChange={(e) => setTipoInteres(e.target.value as 'corriente' | 'maximo' | 'personalizado')}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="corriente">Interes Corriente ({TASA_INTERES_CORRIENTE}% mensual)</option>
              <option value="maximo">Interes Maximo Convencional ({TASA_MAXIMA_CONVENCIONAL.toFixed(2)}% mensual)</option>
              <option value="personalizado">Tasa Personalizada</option>
            </select>
          </div>

          {tipoInteres === 'personalizado' && (
            <div>
              <label className="block text-gray-300 mb-2">Tasa Mensual (%)</label>
              <input
                type="number"
                step="0.01"
                value={tasaPersonalizada}
                onChange={(e) => setTasaPersonalizada(e.target.value)}
                placeholder="2.5"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          )}

          <button
            onClick={calcularIntereses}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Calcular Intereses
          </button>
        </div>

        <div className="space-y-4">
          {resultado && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-lg p-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-amber-400 mb-4">Resultado del Calculo</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-sm">Dias Transcurridos</p>
                  <p className="text-white font-bold">{resultado.diasTranscurridos}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-sm">Meses</p>
                  <p className="text-white font-bold">{resultado.mesesTranscurridos}</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-sm">Tasa Aplicada</p>
                  <p className="text-white font-bold">{resultado.tasaAplicada}% mensual</p>
                </div>
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-gray-400 text-sm">Tasa Anual</p>
                  <p className="text-white font-bold">{(resultado.tasaAplicada * 12).toFixed(2)}%</p>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Capital Original:</span>
                  <span className="text-white font-semibold">{formatCLP(parseFloat(monto))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Intereses Devengados:</span>
                  <span className="text-amber-400 font-semibold">{formatCLP(resultado.interesTotal)}</span>
                </div>
                <div className="flex justify-between text-lg border-t border-gray-700 pt-3">
                  <span className="text-gray-300">Total a Pagar:</span>
                  <span className="text-green-400 font-bold">{formatCLP(resultado.montoFinal)}</span>
                </div>
              </div>
            </motion.div>
          )}

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mt-4">
            <h4 className="text-blue-400 font-semibold mb-2">Informacion Legal</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Tasa de interes corriente: fijada mensualmente por CMF</li>
              <li>• Interes maximo convencional: 1.5x la tasa corriente</li>
              <li>• Art. 2206 CC: limite al interes convencional</li>
              <li>• Ley 18.010: regula operaciones de credito</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InicioView() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl p-8 border border-amber-700"
      >
        <h1 className="text-3xl font-bold text-amber-400 mb-4">Derecho Civil</h1>
        <p className="text-gray-300 text-lg">
          Informacion sobre procedimientos civiles, calculadoras de intereses, plazos procesales y costas judiciales.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { icon: '📊', title: 'Calculadora Intereses', desc: 'Calcula intereses corrientes y maximos convencionales' },
          { icon: '📅', title: 'Plazos Procesales', desc: 'Plazos para recursos y actuaciones civiles' },
          { icon: '💰', title: 'Costas Judiciales', desc: 'Estimacion de costos de juicios civiles' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700"
          >
            <span className="text-4xl">{item.icon}</span>
            <h3 className="text-xl font-semibold text-white mt-4">{item.title}</h3>
            <p className="text-gray-400 mt-2">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-amber-400 mb-4">Materias Civiles Comunes</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            'Cobro de deudas y pagares',
            'Arrendamiento e inmuebles',
            'Responsabilidad contractual',
            'Responsabilidad extracontractual',
            'Contratos y obligaciones',
            'Sucesiones y herencias',
            'Prescripcion de acciones',
            'Nulidad de contratos',
          ].map((tema, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300">
              <span className="text-amber-500">•</span>
              {tema}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PlazosView() {
  const plazos = [
    { recurso: 'Apelacion sentencia definitiva', plazo: '10 dias', base: 'Art. 189 CPC' },
    { recurso: 'Apelacion sentencia interlocutoria', plazo: '5 dias', base: 'Art. 189 CPC' },
    { recurso: 'Casacion forma y fondo', plazo: '15 dias', base: 'Art. 770 CPC' },
    { recurso: 'Reposicion', plazo: '5 dias', base: 'Art. 181 CPC' },
    { recurso: 'Contestacion demanda (ordinario)', plazo: '15 dias', base: 'Art. 258 CPC' },
    { recurso: 'Contestacion demanda (sumario)', plazo: '8 dias', base: 'Art. 683 CPC' },
    { recurso: 'Replica y duplica', plazo: '6 dias c/u', base: 'Art. 311 CPC' },
    { recurso: 'Abandono del procedimiento', plazo: '6 meses', base: 'Art. 152 CPC' },
    { recurso: 'Prescripcion accion ordinaria', plazo: '5 anos', base: 'Art. 2515 CC' },
    { recurso: 'Prescripcion accion ejecutiva', plazo: '3 anos', base: 'Art. 2515 CC' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Plazos Procesales Civiles</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-gray-400">Actuacion/Recurso</th>
                <th className="py-3 px-4 text-gray-400">Plazo</th>
                <th className="py-3 px-4 text-gray-400">Base Legal</th>
              </tr>
            </thead>
            <tbody>
              {plazos.map((p, i) => (
                <tr key={i} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                  <td className="py-3 px-4 text-white">{p.recurso}</td>
                  <td className="py-3 px-4 text-amber-400 font-semibold">{p.plazo}</td>
                  <td className="py-3 px-4 text-gray-400">{p.base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Reglas de Computo</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Plazos de dias: dias habiles (lunes a sabado, excluidos feriados)</li>
          <li>• Plazos de meses/anos: de fecha a fecha</li>
          <li>• Plazos fatales: expiran por el solo ministerio de la ley</li>
          <li>• Dias habiles judiciales: lunes a sabado, no feriados</li>
        </ul>
      </div>
    </motion.div>
  );
}

function CostasView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Costas Judiciales</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Costas Procesales</h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex justify-between">
                <span>Tasa judicial (ingreso causa)</span>
                <span className="text-amber-400">Variable</span>
              </li>
              <li className="flex justify-between">
                <span>Notificaciones</span>
                <span className="text-amber-400">$5.000 - $15.000</span>
              </li>
              <li className="flex justify-between">
                <span>Receptores judiciales</span>
                <span className="text-amber-400">$20.000 - $50.000</span>
              </li>
              <li className="flex justify-between">
                <span>Peritos</span>
                <span className="text-amber-400">Variable</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Costas Personales</h3>
            <ul className="text-gray-300 space-y-2">
              <li className="flex justify-between">
                <span>Honorarios abogado</span>
                <span className="text-amber-400">10-20% cuantia</span>
              </li>
              <li className="flex justify-between">
                <span>Cuota litis (exito)</span>
                <span className="text-amber-400">20-30%</span>
              </li>
              <li className="flex justify-between">
                <span>Procurador</span>
                <span className="text-amber-400">Variable</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
          <h4 className="text-yellow-400 font-semibold mb-2">Condena en Costas</h4>
          <p className="text-gray-300 text-sm">
            La parte totalmente vencida sera condenada en costas, salvo que el tribunal considere
            que tuvo motivos plausibles para litigar (Art. 144 CPC).
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function RecursosView() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h2 className="text-2xl font-bold text-amber-400 mb-6">Recursos Utiles</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { name: 'Poder Judicial', url: 'https://www.pjud.cl', desc: 'Consulta de causas y tramitacion' },
            { name: 'CMF Chile', url: 'https://www.cmfchile.cl', desc: 'Tasas de interes vigentes' },
            { name: 'Biblioteca Congreso', url: 'https://www.bcn.cl/leychile', desc: 'Legislacion actualizada' },
            { name: 'Diario Oficial', url: 'https://www.diariooficial.interior.gob.cl', desc: 'Publicaciones oficiales' },
          ].map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-gray-700/50 hover:bg-gray-700 rounded-lg p-4 transition-colors"
            >
              <h3 className="text-amber-400 font-semibold">{r.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{r.desc}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4">Codigos y Leyes Principales</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            'Codigo Civil',
            'Codigo de Procedimiento Civil',
            'Ley 18.010 (Operaciones de Credito)',
            'Ley 19.496 (Proteccion Consumidor)',
            'Ley 18.101 (Arrendamiento)',
            'Codigo de Comercio',
          ].map((ley, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-300 bg-gray-700/30 rounded px-3 py-2">
              <span className="text-amber-500">📜</span>
              {ley}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function CivilModule() {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'intereses', label: 'Calculadora', icon: '📊' },
    { id: 'plazos', label: 'Plazos', icon: '📅' },
    { id: 'costas', label: 'Costas', icon: '💰' },
    { id: 'recursos', label: 'Recursos', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚖️</span>
              <div>
                <h1 className="text-xl font-bold text-white">Derecho Civil</h1>
                <p className="text-sm text-gray-400">NewCooltura Informada</p>
              </div>
            </div>
            <a
              href="https://newcool-informada.vercel.app"
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              ← Volver al Hub
            </a>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-amber-400 border-amber-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'inicio' && <InicioView key="inicio" />}
          {activeTab === 'intereses' && <InteresesCalculator key="intereses" />}
          {activeTab === 'plazos' && <PlazosView key="plazos" />}
          {activeTab === 'costas' && <CostasView key="costas" />}
          {activeTab === 'recursos' && <RecursosView key="recursos" />}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-auto">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-gray-400 text-sm">
          <p>Esta informacion es referencial. Consulte siempre con un abogado.</p>
          <p className="mt-2">NewCooltura Informada - Derecho Civil</p>
        </div>
      </footer>
    </div>
  );
}
