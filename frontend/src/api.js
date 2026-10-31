const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081/api'
export const MEDIA_URL = API_URL.replace(/\/api$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error inesperado' }))
    throw new Error(error.message ?? 'Error inesperado')
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

async function multipartRequest(path, formData) {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error inesperado' }))
    throw new Error(error.message ?? 'Error inesperado')
  }

  return response.json()
}

export function login(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getDashboard() {
  return request('/dashboard')
}

export function getStudents() {
  return request('/students')
}

export function createStudent(payload) {
  return request('/students', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateStudent(id, payload) {
  return request(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function getCourses() {
  return request('/courses')
}

export function createCourse(payload) {
  return request('/courses', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getEnrollments() {
  return request('/enrollments')
}

export function createEnrollment(payload) {
  return request('/enrollments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getLessons() {
  return request('/classroom/lessons')
}

export function createLesson(payload) {
  return request('/classroom/lessons', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getAssignments() {
  return request('/classroom/assignments')
}

export function createAssignment(payload) {
  return request('/classroom/assignments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getSubmissions() {
  return request('/classroom/submissions')
}

export function createSubmission(payload) {
  return request('/classroom/submissions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  return multipartRequest('/uploads', formData)
}

export function updateProfilePhoto(userId, profilePhotoUrl) {
  return request(`/auth/users/${userId}/profile-photo`, {
    method: 'PUT',
    body: JSON.stringify({ profilePhotoUrl }),
  })
}

export function getAnnouncements() {
  return request('/portal/announcements')
}

export function createAnnouncement(payload) {
  return request('/portal/announcements', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function updateAnnouncement(id, payload) {
  return request(`/portal/announcements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function deleteAnnouncement(id) {
  return request(`/portal/announcements/${id}`, {
    method: 'DELETE',
  })
}

export function getStudentProgress(studentId) {
  return request(`/portal/students/${studentId}/progress`)
}

export function getAttendance(date) {
  return request(`/portal/attendance?date=${date}`)
}

export function getAttendanceRecords() {
  return request('/portal/attendance-records')
}

export function getStudentAttendance(studentId) {
  return request(`/portal/students/${studentId}/attendance`)
}

export function getAttendanceSessions() {
  return request('/portal/attendance-sessions')
}

export function createAttendanceSession(payload) {
  return request('/portal/attendance-sessions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function markAttendance(payload) {
  return request('/portal/attendance', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function createStudentAccount(payload) {
  return request('/portal/student-accounts', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
