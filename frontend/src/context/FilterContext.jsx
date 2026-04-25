import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { classOptions as fallbackClassOptions, studentsByClass as fallbackStudentsByClass } from '../data/students'
import { getStudents } from '../services/studentApi'

const FilterContext = createContext(null)

export function FilterProvider({ children }) {
  const [selectedClass, setSelectedClass] = useState('10')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [schoolData, setSchoolData] = useState({
    classOptions: fallbackClassOptions,
    studentsByClass: fallbackStudentsByClass,
    source: 'fallback'
  })

  useEffect(() => {
    let active = true

    async function loadStudents() {
      try {
        const response = await getStudents()
        if (!active) {
          return
        }
        setSchoolData({
          classOptions: response.classOptions?.length ? response.classOptions : fallbackClassOptions,
          studentsByClass: response.studentsByClass || fallbackStudentsByClass,
          source: response.source || 'api'
        })
      } catch {
        if (active) {
          setSchoolData({
            classOptions: fallbackClassOptions,
            studentsByClass: fallbackStudentsByClass,
            source: 'fallback'
          })
        }
      }
    }

    loadStudents()
    return () => {
      active = false
    }
  }, [])

  const classOptions = schoolData.classOptions
  const studentsByClass = schoolData.studentsByClass
  const classStudents = useMemo(() => studentsByClass[selectedClass] || [], [selectedClass, studentsByClass])

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
    setSelectedStudent,
    dataSource: schoolData.source
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
