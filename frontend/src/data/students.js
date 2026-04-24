export const classOptions = [{ id: '10', label: '10-A' }]

export const studentsByClass = {
  '10': [
    { id: '1001', name: 'Aarav Sharma', className: '10-A', phone: '+91 98765 10101' },
    { id: '1002', name: 'Ananya Rao', className: '10-A', phone: '+91 98765 20202' },
    { id: '1003', name: 'Rahul Mehta', className: '10-A', phone: '+91 98765 30303' },
    { id: '1004', name: 'Sneha Kapoor', className: '10-A', phone: '+91 98765 40404' }
  ]
}

export const attendanceFallbackByStudent = {
  '1001': {
    totalDays: 246,
    totalPresent: 199,
    totalAbsent: 47,
    attendancePercentage: 80.9,
    lateCount: 9,
    history: [
      { date: '24 Apr 2026', day: 'Friday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '23 Apr 2026', day: 'Thursday', status: 'L', periods: '7/8', remarks: 'Late by 8 mins' },
      { date: '22 Apr 2026', day: 'Wednesday', status: 'P', periods: '8/8', remarks: 'Good' },
      { date: '21 Apr 2026', day: 'Tuesday', status: 'A', periods: '0/8', remarks: 'Medical leave' },
      { date: '20 Apr 2026', day: 'Monday', status: 'P', periods: '8/8', remarks: 'On time' }
    ],
    trend: [
      { day: '1 Apr', attendance: 76 },
      { day: '6 Apr', attendance: 81 },
      { day: '12 Apr', attendance: 79 },
      { day: '18 Apr', attendance: 84 },
      { day: '24 Apr', attendance: 81 },
      { day: '30 Apr', attendance: 83 }
    ],
    weeklyAverage: [79, 81, 82, 80, 83, 84, 82],
    monthlyAverage: [76, 78, 80, 81, 80, 82, 81],
    overallAverage: [74, 76, 78, 79, 80, 80, 81]
  },
  '1002': {
    totalDays: 246,
    totalPresent: 226,
    totalAbsent: 20,
    attendancePercentage: 91.9,
    lateCount: 4,
    history: [
      { date: '24 Apr 2026', day: 'Friday', status: 'P', periods: '8/8', remarks: 'Excellent' },
      { date: '23 Apr 2026', day: 'Thursday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '22 Apr 2026', day: 'Wednesday', status: 'P', periods: '8/8', remarks: 'Excellent' },
      { date: '21 Apr 2026', day: 'Tuesday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '20 Apr 2026', day: 'Monday', status: 'L', periods: '8/8', remarks: 'Late by 5 mins' }
    ],
    trend: [
      { day: '1 Apr', attendance: 88 },
      { day: '6 Apr', attendance: 92 },
      { day: '12 Apr', attendance: 91 },
      { day: '18 Apr', attendance: 94 },
      { day: '24 Apr', attendance: 92 },
      { day: '30 Apr', attendance: 93 }
    ],
    weeklyAverage: [90, 92, 91, 93, 92, 94, 93],
    monthlyAverage: [88, 89, 91, 92, 91, 92, 92],
    overallAverage: [86, 88, 89, 90, 91, 92, 92]
  },
  '1003': {
    totalDays: 246,
    totalPresent: 214,
    totalAbsent: 32,
    attendancePercentage: 87,
    lateCount: 6,
    history: [
      { date: '24 Apr 2026', day: 'Friday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '23 Apr 2026', day: 'Thursday', status: 'P', periods: '8/8', remarks: 'Good' },
      { date: '22 Apr 2026', day: 'Wednesday', status: 'L', periods: '7/8', remarks: 'Late by 10 mins' },
      { date: '21 Apr 2026', day: 'Tuesday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '20 Apr 2026', day: 'Monday', status: 'A', periods: '0/8', remarks: 'Personal leave' }
    ],
    trend: [
      { day: '1 Apr', attendance: 84 },
      { day: '6 Apr', attendance: 86 },
      { day: '12 Apr', attendance: 85 },
      { day: '18 Apr', attendance: 88 },
      { day: '24 Apr', attendance: 87 },
      { day: '30 Apr', attendance: 88 }
    ],
    weeklyAverage: [85, 86, 87, 86, 87, 88, 87],
    monthlyAverage: [83, 84, 85, 86, 86, 87, 87],
    overallAverage: [81, 82, 84, 85, 86, 86, 87]
  },
  '1004': {
    totalDays: 246,
    totalPresent: 219,
    totalAbsent: 27,
    attendancePercentage: 89,
    lateCount: 5,
    history: [
      { date: '24 Apr 2026', day: 'Friday', status: 'P', periods: '8/8', remarks: 'Excellent' },
      { date: '23 Apr 2026', day: 'Thursday', status: 'P', periods: '8/8', remarks: 'On time' },
      { date: '22 Apr 2026', day: 'Wednesday', status: 'P', periods: '8/8', remarks: 'Good' },
      { date: '21 Apr 2026', day: 'Tuesday', status: 'L', periods: '7/8', remarks: 'Late by 7 mins' },
      { date: '20 Apr 2026', day: 'Monday', status: 'P', periods: '8/8', remarks: 'On time' }
    ],
    trend: [
      { day: '1 Apr', attendance: 86 },
      { day: '6 Apr', attendance: 88 },
      { day: '12 Apr', attendance: 87 },
      { day: '18 Apr', attendance: 90 },
      { day: '24 Apr', attendance: 89 },
      { day: '30 Apr', attendance: 90 }
    ],
    weeklyAverage: [87, 88, 89, 88, 89, 90, 89],
    monthlyAverage: [85, 86, 87, 88, 88, 89, 89],
    overallAverage: [83, 84, 86, 87, 88, 89, 89]
  }
}

export const marksFallbackByStudent = {
  '1001': {
    overallPercentage: 79.4,
    grade: 'B+',
    rank: '11/42',
    obtained: 397,
    total: 500,
    subjects: [
      { subject: 'Mathematics', max: 100, obtained: 83, grade: 'A' },
      { subject: 'Science', max: 100, obtained: 79, grade: 'B+' },
      { subject: 'English', max: 100, obtained: 78, grade: 'B+' },
      { subject: 'Social Studies', max: 100, obtained: 76, grade: 'B+' },
      { subject: 'Computer Science', max: 100, obtained: 81, grade: 'A' }
    ],
    trend: [72, 75, 78, 80, 79, 82]
  },
  '1002': {
    overallPercentage: 92.4,
    grade: 'A+',
    rank: '2/42',
    obtained: 462,
    total: 500,
    subjects: [
      { subject: 'Mathematics', max: 100, obtained: 95, grade: 'A+' },
      { subject: 'Science', max: 100, obtained: 93, grade: 'A+' },
      { subject: 'English', max: 100, obtained: 89, grade: 'A' },
      { subject: 'Social Studies', max: 100, obtained: 91, grade: 'A+' },
      { subject: 'Computer Science', max: 100, obtained: 94, grade: 'A+' }
    ],
    trend: [86, 90, 91, 93, 92, 94]
  },
  '1003': {
    overallPercentage: 86,
    grade: 'A',
    rank: '6/42',
    obtained: 430,
    total: 500,
    subjects: [
      { subject: 'Mathematics', max: 100, obtained: 88, grade: 'A' },
      { subject: 'Science', max: 100, obtained: 84, grade: 'A' },
      { subject: 'English', max: 100, obtained: 82, grade: 'A' },
      { subject: 'Social Studies', max: 100, obtained: 85, grade: 'A' },
      { subject: 'Computer Science', max: 100, obtained: 91, grade: 'A+' }
    ],
    trend: [80, 82, 84, 86, 87, 88]
  },
  '1004': {
    overallPercentage: 89.2,
    grade: 'A',
    rank: '4/42',
    obtained: 446,
    total: 500,
    subjects: [
      { subject: 'Mathematics', max: 100, obtained: 90, grade: 'A+' },
      { subject: 'Science', max: 100, obtained: 88, grade: 'A' },
      { subject: 'English', max: 100, obtained: 87, grade: 'A' },
      { subject: 'Social Studies', max: 100, obtained: 89, grade: 'A' },
      { subject: 'Computer Science', max: 100, obtained: 92, grade: 'A+' }
    ],
    trend: [84, 86, 88, 89, 90, 91]
  }
}

export const classAverageTrend = [70, 72, 74, 75, 76, 77]
export const examLabels = ['Unit Test 1', 'Unit Test 2', 'Mid Term', 'Unit Test 3', 'Pre Final', 'Final']
