import * as React from "react"

const columns = [
  { Header: "NOMBRE ESTUDIANTE", accessor: "nombreEstudiante" },
  { Header: "Rut", accessor: "rut" },
  { Header: "CARRERA", accessor: "carrera" },
  { Header: "NOMBRE EMPRESA", accessor: "nombreEmpresa" },
  { Header: "Jefe Directo", accessor: "jefeDirecto" },
  { Header: "Email", accessor: "email" },
  { Header: "Cargo", accessor: "cargo" },
  { Header: "semestre", accessor: "semestre" },
  { Header: "AÑO", accessor: "anio" },
  { Header: "EVALUACION ENVIADA", accessor: "evaluacionEnviada" },
]

const sampleData = [
  // Puedes agregar datos de ejemplo aquí
]

export function DataTableBiblioteca({ data = sampleData }) {
  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-blue-100">
          <tr>
            {columns.map((col) => (
              <th key={col.accessor} className="px-4 py-2 border-b text-xs font-bold text-blue-900">
                {col.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-blue-50">
                {columns.map((col) => (
                  <td key={col.accessor} className="px-4 py-2 border-b text-sm">
                    {row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
