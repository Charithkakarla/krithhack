import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { classOptions, studentsByClass } from '../data/students'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [selectedClass, setSelectedClass] = useState('10')
  const [selectedStudent, setSelectedStudent] = useState(null)

  const classStudents = useMemo(() => studentsByClass[selectedClass] || [], [selectedClass])

  useEffect(() => {
    if (!selectedStudent && classStudents.length > 0) {
      setSelectedStudent(classStudents[0])
      return
    }

    if (selectedStudent && !classStudents.some((student) => student.id === selectedStudent.id)) {
      setSelectedStudent(classStudents[0] || null)
    }
  }, [classStudents, selectedStudent])

  const value = {
    classOptions,
    selectedClass,
    setSelectedClass,
    selectedClassLabel: classOptions.find((item) => item.id === selectedClass)?.label || '10-A',
    classStudents,
    selectedStudent,
    setSelectedStudent
  }

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error('useFilters must be used inside FilterProvider')
  }
  return context
}
