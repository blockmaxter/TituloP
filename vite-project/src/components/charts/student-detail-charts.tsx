import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useFirebaseData } from "@/hooks/useFirebaseData"

// Función helper para normalizar el estado de evaluación
const normalizeEvaluationStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const normalized = status.toString().toLowerCase().trim();
  return normalized === 'si' || normalized === 'sí' || normalized === 'yes' || normalized === 'true' || normalized === '1';
};

interface StudentData {
  id?: string;
  nombreEstudiante: string;
  rut: string;
  facultad: string;
  carrera: string;
  nombreEmpresa: string;
  comuna: string;
  supervisorPractica: string;
  emailAlumno: string;
  cargo: string;
  areaEstudiante: string;
  semestre: string;
  anioPractica: string;
  anioIngreso: string;
  evaluacionEnviada: string;
  fechaImportacion?: string;
}

interface StudentDetailChartsProps {
  student: StudentData;
}

// Componente para mostrar comparación con otros estudiantes de la misma carrera
export function StudentCareerComparisonChart({ student }: StudentDetailChartsProps) {
  const { data } = useFirebaseData();

  const comparisonData = React.useMemo(() => {
    const sameCareerStudents = data.filter(s => s.carrera === student.carrera);
    const otherCareersStudents = data.filter(s => s.carrera !== student.carrera);
    
    return [
      {
        name: `Misma carrera (${student.carrera})`,
        cantidad: sameCareerStudents.length,
        color: "#3B82F6"
      },
      {
        name: "Otras carreras",
        cantidad: otherCareersStudents.length,
        color: "#E5E7EB"
      }
    ];
  }, [data, student.carrera]);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📊 Contexto por Carrera
        </CardTitle>
        <CardDescription>
          Comparación con otros estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={comparisonData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="cantidad"
              label={({ value }) => `${value}`}
            >
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Este estudiante es uno de {comparisonData[0]?.cantidad || 0} en su carrera
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar estadísticas de la empresa
export function StudentCompanyChart({ student }: StudentDetailChartsProps) {
  const { data } = useFirebaseData();

  const companyData = React.useMemo(() => {
    const sameCompanyStudents = data.filter(s => s.nombreEmpresa === student.nombreEmpresa);
    const companyCommuneStats = data.filter(s => s.nombreEmpresa === student.nombreEmpresa)
      .reduce((acc, curr) => {
        acc[curr.comuna] = (acc[curr.comuna] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const communeData = Object.entries(companyCommuneStats).map(([comuna, cantidad]) => ({
      comuna,
      cantidad,
      esEstudianteActual: comuna === student.comuna
    }));

    return {
      totalInCompany: sameCompanyStudents.length,
      communeDistribution: communeData
    };
  }, [data, student.nombreEmpresa, student.comuna]);

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🏢 Estadísticas de la Empresa
        </CardTitle>
        <CardDescription>
          {student.nombreEmpresa}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{companyData.totalInCompany}</div>
              <div className="text-sm text-green-800">estudiante(s) en esta empresa</div>
            </div>
          </div>
          
          {companyData.communeDistribution.length > 1 && (
            <>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Distribución por Comuna</h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={companyData.communeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="comuna" fontSize={12} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cantidad" radius={[4, 4, 0, 0]}>
                    {companyData.communeDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.esEstudianteActual ? "#10B981" : "#E5E7EB"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar estadísticas del área
export function StudentAreaChart({ student }: StudentDetailChartsProps) {
  const { data } = useFirebaseData();

  const areaStats = React.useMemo(() => {
    const sameAreaStudents = data.filter(s => s.areaEstudiante === student.areaEstudiante);
    const evaluationStats = sameAreaStudents.reduce((acc, curr) => {
      const status = normalizeEvaluationStatus(curr.evaluacionEnviada) ? 'completada' : 'pendiente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalInArea: sameAreaStudents.length,
      evaluationData: [
        {
          name: "Completadas",
          value: evaluationStats.completada || 0,
          color: "#10B981"
        },
        {
          name: "Pendientes", 
          value: evaluationStats.pendiente || 0,
          color: "#F59E0B"
        }
      ]
    };
  }, [data, student.areaEstudiante]);

  return (
    <Card className="border-l-4 border-l-purple-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          🎯 Estadísticas del Área
        </CardTitle>
        <CardDescription>
          {student.areaEstudiante}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{areaStats.totalInArea}</div>
              <div className="text-sm text-purple-800">estudiante(s) en esta área</div>
            </div>
          </div>

          {areaStats.totalInArea > 1 && (
            <>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300">Estado de Evaluaciones en el Área</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={areaStats.evaluationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {areaStats.evaluationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para mostrar estadísticas de evaluaciones en la carrera
export function StudentCareerEvaluationChart({ student }: StudentDetailChartsProps) {
  const { data } = useFirebaseData();

  const careerEvaluationStats = React.useMemo(() => {
    const sameCareerStudents = data.filter(s => s.carrera === student.carrera);
    const evaluationStats = sameCareerStudents.reduce((acc, curr) => {
      const status = normalizeEvaluationStatus(curr.evaluacionEnviada) ? 'completada' : 'pendiente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const studentStatus = normalizeEvaluationStatus(student.evaluacionEnviada) ? 'completada' : 'pendiente';
    
    return {
      totalInCareer: sameCareerStudents.length,
      studentStatus,
      evaluationData: [
        {
          name: "Completadas",
          value: evaluationStats.completada || 0,
          color: "#10B981",
          isStudentCategory: studentStatus === 'completada'
        },
        {
          name: "Pendientes", 
          value: evaluationStats.pendiente || 0,
          color: "#F59E0B",
          isStudentCategory: studentStatus === 'pendiente'
        }
      ]
    };
  }, [data, student.carrera, student.evaluacionEnviada]);

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📋 Evaluaciones en la Carrera
        </CardTitle>
        <CardDescription>
          Estado de evaluaciones en {student.carrera}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600">{careerEvaluationStats.totalInCareer}</div>
              <div className="text-sm text-indigo-800">estudiante(s) en esta carrera</div>
            </div>
          </div>

          {careerEvaluationStats.totalInCareer > 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {careerEvaluationStats.evaluationData.map((item, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg text-center ${
                      item.isStudentCategory ? 'ring-2 ring-blue-500 bg-blue-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl font-bold" style={{ color: item.color }}>
                      {item.value}
                    </div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">{item.name}</div>
                    {item.isStudentCategory && (
                      <div className="text-xs text-blue-600 mt-1 font-medium">
                        (Incluye este estudiante)
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <ResponsiveContainer width="100%" height={120}>
                <PieChart>
                  <Pie
                    data={careerEvaluationStats.evaluationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={40}
                    dataKey="value"
                    label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {careerEvaluationStats.evaluationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={entry.isStudentCategory ? "#3B82F6" : "transparent"}
                        strokeWidth={entry.isStudentCategory ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para timeline del estudiante
export function StudentTimelineChart({ student }: StudentDetailChartsProps) {
  const timelineData = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const ingresoYear = parseInt(student.anioIngreso) || currentYear;
    const practicaYear = parseInt(student.anioPractica) || currentYear;
    
    return [
      {
        year: ingresoYear,
        event: "Ingreso a la carrera",
        type: "ingreso",
        color: "#3B82F6"
      },
      {
        year: practicaYear,
        event: "Inicio de práctica",
        type: "practica",
        color: "#10B981"
      },
      {
        year: currentYear,
        event: "Estado actual",
        type: "actual",
        color: "#F59E0B"
      }
    ].sort((a, b) => a.year - b.year);
  }, [student.anioIngreso, student.anioPractica]);

  return (
    <Card className="border-l-4 border-l-indigo-500">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          📅 Timeline Académico
        </CardTitle>
        <CardDescription>
          Cronología del estudiante
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{item.event}</div>
                <div className="text-sm text-gray-600">{item.year}</div>
              </div>
            </div>
          ))}
          
          {student.anioIngreso && student.anioPractica && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
              <div className="text-center">
                <div className="text-lg font-bold text-indigo-600">
                  {parseInt(student.anioPractica) - parseInt(student.anioIngreso)} años
                </div>
                <div className="text-sm text-indigo-800">desde el ingreso hasta la práctica</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}