import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  Bell,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Gauge,
  GraduationCap,
  Home,
  IdCard,
  LayoutGrid,
  List,
  LogOut,
  Megaphone,
  Menu,
  PlayCircle,
  Plus,
  RefreshCw,
  Search,
  Upload,
  Users,
} from 'lucide-react'
import {
  createAnnouncement,
  createAssignment,
  createAttendanceSession,
  createCourse,
  createEnrollment,
  createLesson,
  createStudentAccount,
  createSubmission,
  deleteAnnouncement,
  getAnnouncements,
  getAssignments,
  getAttendanceRecords,
  getAttendanceSessions,
  getCourses,
  getDashboard,
  getEnrollments,
  getLessons,
  getStudentProgress,
  getStudentAttendance,
  getStudents,
  getSubmissions,
  login,
  markAttendance,
  updateStudent,
  updateAnnouncement,
  uploadFile,
  updateProfilePhoto,
  MEDIA_URL,
} from './api'

const today = new Date().toISOString().slice(0, 10)

const emptyStudentAccount = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  documentNumber: '',
  phone: '',
  guardianName: '',
  guardianPhone: '',
  guardianRelationship: '',
  secondGuardianName: '',
  secondGuardianPhone: '',
  secondGuardianRelationship: '',
  password: '',
  role: 'STUDENT',
}

const emptyAnnouncement = {
  title: '',
  body: '',
  category: 'COMUNICADO',
  audience: 'STUDENT',
}

const emptyAttendanceSession = {
  courseId: '',
  title: 'Control de asistencia',
  sessionDate: today,
  weekNumber: 1,
}

const emptyLessonForm = {
  title: '',
  description: '',
  materialType: 'VIDEO',
  materialUrl: '',
  durationMinutes: 45,
  weekNumber: 1,
}

const emptyAssignmentForm = {
  title: '',
  instructions: '',
  startAt: `${today}T08:00:00`,
  endAt: `${today}T23:59:59`,
  maxScore: 20,
}

const emptyCourseForm = {
  code: '',
  name: '',
  credits: 4,
  teacher: 'Academia Jose Pisconte',
}

const emptyEnrollmentForm = {
  studentId: '',
  courseId: '',
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = window.localStorage.getItem('jp-user')
    return saved ? JSON.parse(saved) : null
  })
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [activeView, setActiveView] = useState('home')
  const [dashboard, setDashboard] = useState({})
  const [announcements, setAnnouncements] = useState([])
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [progress, setProgress] = useState([])
  const [attendance, setAttendance] = useState([])
  const [attendanceSessions, setAttendanceSessions] = useState([])
  const [studentAttendance, setStudentAttendance] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [announcementForm, setAnnouncementForm] = useState(emptyAnnouncement)
  const [attendanceSessionForm, setAttendanceSessionForm] = useState(emptyAttendanceSession)
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null)
  const [studentForm, setStudentForm] = useState(emptyStudentAccount)
  const [editingStudent, setEditingStudent] = useState(null)
  const [submissionForm, setSubmissionForm] = useState({ assignmentId: '', studentComment: '' })
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [lessonForm, setLessonForm] = useState(emptyLessonForm)
  const [assignmentForm, setAssignmentForm] = useState(emptyAssignmentForm)
  const [courseForm, setCourseForm] = useState(emptyCourseForm)
  const [enrollmentForm, setEnrollmentForm] = useState(emptyEnrollmentForm)
  const [lessonFile, setLessonFile] = useState(null)
  const [query, setQuery] = useState('')
  const [studentView, setStudentView] = useState('list')
  const [photoVersion, setPhotoVersion] = useState(Date.now())
  const [status, setStatus] = useState({ loading: false, error: '', message: '' })

  const isTeacher = isTeachingRole(currentUser?.role)
  const isAdmin = currentUser?.role === 'ADMIN'
  const visibleAnnouncements = announcements.filter((item) => canSeeAnnouncement(item, currentUser?.role))
  const semesterAverage = progress.length ? average(progress.map((item) => item.averageScore)) : 0
  const overallAttendance = progress.length ? average(progress.map((item) => item.attendancePercent)) : 0

  const filteredStudents = students.filter((student) => `${student.firstName} ${student.lastName} ${student.documentNumber} ${student.guardianName ?? ''} ${student.secondGuardianName ?? ''}`.toLowerCase().includes(query.toLowerCase()))
  const studentEnrollments = enrollments.filter((enrollment) => enrollment.student.id === currentUser?.studentId)

  useEffect(() => {
    if (currentUser) {
      loadPortal()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id])

  async function loadPortal(message = '') {
    setStatus({ loading: true, error: '', message })
    try {
      const [dashboardData, announcementData, studentData, courseData, enrollmentData, lessonData, assignmentData, submissionData, attendanceData, sessionData] = await Promise.all([
        getDashboard(),
        getAnnouncements(),
        getStudents(),
        getCourses(),
        getEnrollments(),
        getLessons(),
        getAssignments(),
        getSubmissions(),
        getAttendanceRecords(),
        getAttendanceSessions(),
      ])
      const progressData = currentUser.studentId ? await getStudentProgress(currentUser.studentId) : []
      const studentAttendanceData = currentUser.studentId ? await getStudentAttendance(currentUser.studentId) : []
      setDashboard(dashboardData)
      setAnnouncements(announcementData)
      setStudents(studentData)
      setCourses(courseData)
      setEnrollments(enrollmentData)
      setLessons(lessonData)
      setAssignments(assignmentData)
      setSubmissions(submissionData)
      setAttendance(attendanceData)
      setAttendanceSessions(sessionData)
      setStudentAttendance(studentAttendanceData)
      setProgress(progressData)
      setSubmissionForm((current) => ({ ...current, assignmentId: current.assignmentId || assignmentData[0]?.id || '' }))
      setAttendanceSessionForm((current) => ({ ...current, courseId: current.courseId || courseData[0]?.id || '' }))
      setEnrollmentForm((current) => ({
        ...current,
        studentId: current.studentId || studentData[0]?.id || '',
        courseId: current.courseId || courseData[0]?.id || '',
      }))
      setStatus({ loading: false, error: '', message })
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  async function handleLogin(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '', message: '' })
    try {
      const user = await login(loginForm)
      window.localStorage.setItem('jp-user', JSON.stringify(user))
      setCurrentUser(user)
      setActiveView('home')
      setStatus({ loading: false, error: '', message: `Bienvenido, ${user.displayName}` })
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  function logout() {
    window.localStorage.removeItem('jp-user')
    setCurrentUser(null)
    setStatus({ loading: false, error: '', message: '' })
  }

  async function handleAnnouncement(event) {
    event.preventDefault()
    await runMutation(
      () => {
        const payload = { ...announcementForm, createdBy: currentUser.displayName, createdByUsername: currentUser.username }
        return editingAnnouncementId ? updateAnnouncement(editingAnnouncementId, payload) : createAnnouncement(payload)
      },
      editingAnnouncementId ? 'Comunicado actualizado' : 'Comunicado publicado'
    )
    setAnnouncementForm(emptyAnnouncement)
    setEditingAnnouncementId(null)
  }

  async function handleDeleteAnnouncement(id) {
    await runMutation(() => deleteAnnouncement(id), 'Comunicado eliminado')
  }

  function handleEditAnnouncement(announcement) {
    setEditingAnnouncementId(announcement.id)
    setAnnouncementForm({
      title: announcement.title,
      body: announcement.body,
      category: announcement.category,
      audience: announcement.audience,
    })
  }

  async function handleStudentAccount(event) {
    event.preventDefault()
    await runMutation(() => createStudentAccount(studentForm), 'Estudiante y usuario creados')
    setStudentForm(emptyStudentAccount)
  }

  async function handleUpdateStudent(event) {
    event.preventDefault()
    if (!editingStudent) return
    await runMutation(
      () => updateStudent(editingStudent.id, {
        firstName: editingStudent.firstName,
        lastName: editingStudent.lastName,
        email: editingStudent.email,
        documentNumber: editingStudent.documentNumber,
        guardianName: editingStudent.guardianName,
        guardianPhone: editingStudent.guardianPhone,
        guardianRelationship: editingStudent.guardianRelationship,
        secondGuardianName: editingStudent.secondGuardianName,
        secondGuardianPhone: editingStudent.secondGuardianPhone,
        secondGuardianRelationship: editingStudent.secondGuardianRelationship,
      }),
      'Datos del estudiante actualizados'
    )
    setEditingStudent(null)
  }

  async function handleCourse(event) {
    event.preventDefault()
    await runMutation(
      () => createCourse({
        ...courseForm,
        credits: Number(courseForm.credits),
      }),
      'Curso registrado correctamente'
    )
    setCourseForm(emptyCourseForm)
  }

  async function handleEnrollment(event) {
    event.preventDefault()
    await runMutation(
      () => createEnrollment(enrollmentForm),
      'Estudiante matriculado en el curso'
    )
  }

  async function handleStudentAttendance(session) {
    await runMutation(
      () => markAttendance({
        studentId: currentUser.studentId,
        courseId: session.course.id,
        sessionId: session.id,
        classDate: session.sessionDate,
        status: 'PRESENT',
        remarks: `Marcado por estudiante en ${session.title}`,
        markedBy: currentUser.displayName,
      }),
      'Asistencia marcada'
    )
  }

  async function handleTeacherAttendance(studentId, session, statusValue) {
    await runMutation(
      () => markAttendance({
        studentId,
        courseId: session.course.id,
        sessionId: session.id,
        classDate: session.sessionDate,
        status: statusValue,
        remarks: `Actualizado por docente en ${session.title}`,
        markedBy: currentUser.displayName,
      }),
      'Asistencia actualizada'
    )
  }

  async function handleAttendanceSession(event) {
    event.preventDefault()
    await runMutation(
      () => createAttendanceSession({ ...attendanceSessionForm, createdBy: currentUser.displayName }),
      'Sesion de asistencia creada'
    )
    setAttendanceSessionForm((current) => ({ ...current, title: 'Control de asistencia', weekNumber: Number(current.weekNumber) + 1 }))
  }

  async function handleSubmitHomework(event, assignmentIdOverride = null) {
    event.preventDefault()
    if (!selectedFile) {
      setStatus({ loading: false, error: 'Selecciona una imagen, video o PDF', message: '' })
      return
    }
    setStatus({ loading: true, error: '', message: '' })
    try {
      const uploaded = await uploadFile(selectedFile)
      await createSubmission({
        assignmentId: assignmentIdOverride ?? submissionForm.assignmentId,
        studentId: currentUser.studentId,
        artifactType: typeFromContent(uploaded.contentType),
        artifactUrl: uploaded.url,
        artifactName: uploaded.originalName,
        studentComment: submissionForm.studentComment,
      })
      setSelectedFile(null)
      setSubmissionForm((current) => ({ ...current, studentComment: '' }))
      await loadPortal('Tarea enviada y revisada por IA demo')
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  async function handleCreateLesson(event) {
    event.preventDefault()
    if (!selectedCourseId) return
    setStatus({ loading: true, error: '', message: '' })
    try {
      const courseLessons = lessons.filter((lesson) => lesson.course.id === selectedCourseId)
      const uploaded = lessonFile ? await uploadFile(lessonFile) : null
      await createLesson({
        courseId: selectedCourseId,
        title: lessonForm.title,
        description: lessonForm.description,
        videoUrl: uploaded?.url ?? lessonForm.materialUrl,
        materialType: lessonForm.materialType,
        materialName: uploaded?.originalName ?? lessonForm.title,
        durationMinutes: Number(lessonForm.durationMinutes),
        sequence: courseLessons.length + 1,
        weekNumber: Number(lessonForm.weekNumber),
      })
      setLessonForm(emptyLessonForm)
      setLessonFile(null)
      await loadPortal('Material publicado en el aula virtual')
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  async function handleCreateAssignment(event) {
    event.preventDefault()
    if (!selectedCourseId) return
    await runMutation(
      () => createAssignment({
        courseId: selectedCourseId,
        title: assignmentForm.title,
        instructions: assignmentForm.instructions,
        startAt: assignmentForm.startAt,
        endAt: assignmentForm.endAt,
        maxScore: Number(assignmentForm.maxScore),
      }),
      'Tarea creada en el aula virtual'
    )
    setAssignmentForm(emptyAssignmentForm)
  }

  async function handleProfilePhoto(file) {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setStatus({ loading: false, error: 'Selecciona una imagen para la foto de perfil', message: '' })
      return
    }
    setStatus({ loading: true, error: '', message: '' })
    try {
      const uploaded = await uploadFile(file)
      const updatedUser = await updateProfilePhoto(currentUser.id, uploaded.url)
      window.localStorage.setItem('jp-user', JSON.stringify(updatedUser))
      setCurrentUser(updatedUser)
      setPhotoVersion(Date.now())
      setStatus({ loading: false, error: '', message: 'Foto de perfil actualizada' })
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  async function runMutation(action, message) {
    setStatus({ loading: true, error: '', message: '' })
    try {
      await action()
      await loadPortal(message)
    } catch (error) {
      setStatus({ loading: false, error: error.message, message: '' })
    }
  }

  if (!currentUser) {
    return <LoginScreen form={loginForm} onChange={setLoginForm} onLogin={handleLogin} status={status} />
  }

  return (
    <div className="portal-shell">
      <Sidebar activeView={activeView} isAdmin={isAdmin} onNavigate={setActiveView} user={currentUser} />
      <main className="portal-main">
        <Topbar activeView={activeView} logout={logout} refresh={() => loadPortal()} status={status} user={currentUser} />
        {status.error && <p className="alert error">{status.error}</p>}
        {status.message && <p className="alert success">{status.message}</p>}

        {activeView === 'home' && (
          <HomeView
            announcements={visibleAnnouncements}
            isTeacher={isTeacher}
            form={announcementForm}
            onChange={setAnnouncementForm}
            onDelete={handleDeleteAnnouncement}
            onEdit={handleEditAnnouncement}
            onSubmit={handleAnnouncement}
            status={status}
            user={currentUser}
          />
        )}

        {activeView === 'dashboard' && (
          <DashboardView
            attendancePercent={overallAttendance}
            courses={isTeacher ? courses : progress}
            dashboard={dashboard}
            isTeacher={isTeacher}
            semesterAverage={semesterAverage}
          />
        )}

        {activeView === 'account' && (
          <AccountView
            courses={isTeacher ? courses : progress}
            dashboard={dashboard}
            onNavigate={setActiveView}
            onPhotoChange={handleProfilePhoto}
            photoVersion={photoVersion}
            progress={progress}
            student={students.find((item) => item.id === currentUser.studentId)}
            user={currentUser}
          />
        )}

        {activeView === 'classroom' && (
          <ClassroomView
            assignments={assignments}
            assignmentForm={assignmentForm}
            courses={isTeacher ? courses : progress.map((item) => ({ id: item.courseId, code: item.code, name: item.name, teacher: item.teacher }))}
            handleSubmitHomework={handleSubmitHomework}
            isTeacher={isTeacher}
            lessonFile={lessonFile}
            lessonForm={lessonForm}
            lessons={lessons}
            onBack={() => { setSelectedCourseId(null); setSelectedActivity(null) }}
            onCreateAssignment={handleCreateAssignment}
            onCreateLesson={handleCreateLesson}
            onOpenActivity={setSelectedActivity}
            onSelectCourse={setSelectedCourseId}
            selectedActivity={selectedActivity}
            selectedCourse={courses.find((course) => course.id === selectedCourseId)}
            selectedFile={selectedFile}
            setAssignmentForm={setAssignmentForm}
            setLessonFile={setLessonFile}
            setLessonForm={setLessonForm}
            setSelectedFile={setSelectedFile}
            setSubmissionForm={setSubmissionForm}
            status={status}
            submissionForm={submissionForm}
            submissions={submissions}
          />
        )}

        {activeView === 'attendance' && (
          <AttendanceView
            attendance={attendance}
            attendanceSessionForm={attendanceSessionForm}
            attendanceSessions={attendanceSessions}
            courses={courses}
            enrollments={isTeacher ? enrollments : studentEnrollments}
            isTeacher={isTeacher}
            onChangeSession={setAttendanceSessionForm}
            onCreateSession={handleAttendanceSession}
            onMarkStudent={handleStudentAttendance}
            onMarkTeacher={handleTeacherAttendance}
            progress={progress}
            studentAttendance={studentAttendance}
            student={students.find((item) => item.id === currentUser.studentId)}
            user={currentUser}
          />
        )}

        {activeView === 'students' && isAdmin && (
          <StudentsView
            courseForm={courseForm}
            courses={courses}
            editingStudent={editingStudent}
            enrollmentForm={enrollmentForm}
            enrollments={enrollments}
            form={studentForm}
            onChangeCourse={setCourseForm}
            onChangeEnrollment={setEnrollmentForm}
            onChange={setStudentForm}
            onCancelEdit={() => setEditingStudent(null)}
            onEditStudent={setEditingStudent}
            onSubmitCourse={handleCourse}
            onSubmitEnrollment={handleEnrollment}
            onSaveStudent={handleUpdateStudent}
            onSubmit={handleStudentAccount}
            query={query}
            setQuery={setQuery}
            setStudentView={setStudentView}
            studentView={studentView}
            students={filteredStudents}
          />
        )}
      </main>
    </div>
  )
}

function LoginScreen({ form, onChange, onLogin, status }) {
  return (
    <main className="login-shell">
      <section className="login-card">
        <div className="login-brand">
          <BrandLogo />
          <p>Reforzamiento academico preuniversitario</p>
        </div>
        <form className="login-form" onSubmit={onLogin}>
          <p className="eyebrow">Aula virtual</p>
          <h2>Ingreso al sistema</h2>
          <input placeholder="Usuario" value={form.username} onChange={(event) => onChange({ ...form, username: event.target.value })} required />
          <input placeholder="Contrasena" type="password" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} required />
          <button className="primary-button" disabled={status.loading} type="submit">Ingresar</button>
          {status.error && <p className="alert error">{status.error}</p>}
        </form>
      </section>
    </main>
  )
}

function Sidebar({ activeView, isAdmin, onNavigate, user }) {
  const links = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'account', label: 'Mi cuenta', icon: IdCard },
    { id: 'classroom', label: 'Aula virtual', icon: PlayCircle },
    { id: 'attendance', label: 'Asistencia', icon: ClipboardCheck },
    ...(isAdmin ? [{ id: 'students', label: 'Cuentas y matriculados', icon: Users }] : []),
  ]
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <BrandLogo compact />
        <span>ACADEMIA | JP</span>
      </div>
      <div className="sidebar-user">
        <UserAvatar user={user} />
        <strong>{user.displayName}</strong>
        <small>{roleLabel(user.role)}</small>
      </div>
      <label className="search-box">
        <Search size={17} />
        <input placeholder="Search" />
      </label>
      <nav>
        {links.map((link) => {
          const Icon = link.icon
          return (
            <button className={activeView === link.id ? 'active' : ''} key={link.id} onClick={() => onNavigate(link.id)} type="button">
              <Icon size={18} />
              {link.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

function UserAvatar({ user }) {
  if (user.profilePhotoUrl) {
    return <img alt={`Foto de ${user.displayName}`} className="avatar avatar-image" src={mediaSrc(user.profilePhotoUrl)} />
  }
  return <div className="avatar">{initials(user.displayName)}</div>
}

function Topbar({ activeView, logout, refresh, status, user }) {
  return (
    <header className="topbar">
      <button className="ghost-button" title="Menu" type="button"><Menu size={20} /></button>
      <div className="breadcrumb">
        <span>{titleFor(activeView)}</span>
        <small>Inicio / {titleFor(activeView)}</small>
      </div>
      <div className="topbar-actions">
        <span className="role-badge">{roleLabel(user.role)}</span>
        <button className="ghost-button" disabled={status.loading} onClick={refresh} title="Actualizar" type="button"><RefreshCw size={18} /></button>
        <button className="ghost-button" onClick={logout} title="Salir" type="button"><LogOut size={18} /></button>
      </div>
    </header>
  )
}

function AccountView({ courses, dashboard, onNavigate, onPhotoChange, photoVersion, progress, student, user }) {
  const isStudent = user.role === 'STUDENT'
  const attendancePercent = progress.length ? average(progress.map((item) => item.attendancePercent)) : 0
  const semesterAverage = progress.length ? average(progress.map((item) => item.averageScore)) : 0
  const reportCards = isStudent
    ? [
        { icon: FileText, title: 'Ficha de matricula', text: 'Datos de inscripcion y cursos activos.', target: 'dashboard' },
        { icon: BarChart3, title: 'Boleta de notas', text: `${progress.length} cursos con practicas registradas.`, target: 'dashboard' },
        { icon: CalendarDays, title: 'Asistencia', text: `${Math.round(attendancePercent)}% de asistencia general.`, target: 'attendance' },
        { icon: GraduationCap, title: 'Promedio ponderado', text: semesterAverage ? semesterAverage.toFixed(2) : 'Sin notas aun.', target: 'dashboard' },
      ]
    : [
        { icon: Users, title: 'Estudiantes matriculados', text: `${dashboard.students ?? 0} estudiantes registrados.`, target: user.role === 'ADMIN' ? 'students' : 'dashboard' },
        { icon: BookOpen, title: 'Cursos activos', text: `${courses.length} cursos registrados.`, target: 'classroom' },
        { icon: Megaphone, title: 'Comunicados', text: 'Crear, editar y borrar publicaciones segun permisos.', target: 'home' },
        { icon: ClipboardCheck, title: 'Asistencia diaria', text: 'Revision y modificacion de asistencias.', target: 'attendance' },
      ]

  return (
    <section className="account-layout">
      <Panel className="wide-panel" icon={IdCard} title={isStudent ? 'Detalles del estudiante' : 'Detalles del admin docente'}>
        <div className="account-profile">
          <div className="profile-photo-block">
            <div className="profile-photo">
              {user.profilePhotoUrl
                ? <img alt={`Foto de ${user.displayName}`} src={mediaSrc(user.profilePhotoUrl, photoVersion)} />
                : <span>{initials(user.displayName)}</span>}
            </div>
            <label className="upload-photo">
              Cambiar foto
              <input accept="image/*" onChange={(event) => onPhotoChange(event.target.files[0])} type="file" />
            </label>
            <small>PNG, JPG o WEBP. Ideal para carnet y perfil.</small>
          </div>
          <div className="account-details">
            <InfoRow label="Usuario" value={user.username} />
            <InfoRow label="Rol" value={roleLabel(user.role)} />
            <InfoRow label={isStudent ? 'Estudiante' : 'Admin docente'} value={user.displayName} />
            <InfoRow label="E-mail" value={user.email} />
            {isStudent && <InfoRow label="DNI" value={student?.documentNumber ?? 'Pendiente'} />}
            <InfoRow label="Telefono" value={user.phone ?? 'Pendiente'} />
            {isStudent && <InfoRow label="Apoderado" value={student?.guardianName ?? 'Pendiente'} />}
            {isStudent && <InfoRow label="Telefono apoderado" value={student?.guardianPhone ?? 'Pendiente'} />}
            {isStudent && student?.secondGuardianName && <InfoRow label="Segundo apoderado" value={student.secondGuardianName} />}
            {isStudent && student?.secondGuardianPhone && <InfoRow label="Telefono segundo apoderado" value={student.secondGuardianPhone} />}
            {isStudent && <InfoRow label="Programa" value="Reforzamiento academico preuniversitario" />}
            {isStudent && <InfoRow label="Modalidad" value="Presencial con aula virtual" />}
            {isStudent && <InfoRow label="Situacion" value="Activo" badge />}
            {!isStudent && <InfoRow label="Area" value="Administracion academica" />}
            {!isStudent && <InfoRow label="Permisos" value="Acceso total como docente admin/dueÃ±o de la academia" />}
          </div>
        </div>
      </Panel>

      <Panel className="wide-panel" icon={FileText} title={isStudent ? 'Reportes del estudiante' : 'Herramientas del admin'}>
        <div className="report-grid">
          {reportCards.map((card) => {
            const Icon = card.icon
            return (
              <button className="report-card" key={card.title} onClick={() => onNavigate(card.target)} type="button">
                <Icon size={42} />
                <strong>{card.title}</strong>
                <span>{card.text}</span>
              </button>
            )
          })}
        </div>
      </Panel>
    </section>
  )
}

function InfoRow({ badge = false, label, value }) {
  return (
    <div className="info-row">
      <strong>{label}:</strong>
      {badge ? <span className="pill present">{value}</span> : <span>{value}</span>}
    </div>
  )
}

function Field({ children, help, label }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {help && <small>{help}</small>}
    </label>
  )
}

function HomeView({ announcements, form, isTeacher, onChange, onDelete, onEdit, onSubmit, status, user }) {
  const comunicados = announcements.filter((item) => item.category === 'COMUNICADO')
  const anuncios = announcements.filter((item) => item.category === 'ANUNCIO')
  return (
    <section className="home-grid">
      <Panel icon={Bell} title="Comunicados">
        <NoticeList notices={comunicados} onDelete={onDelete} onEdit={onEdit} user={user} />
      </Panel>
      <Panel icon={Megaphone} title="Anuncios">
        <NoticeList notices={anuncios} onDelete={onDelete} onEdit={onEdit} user={user} />
      </Panel>
      {isTeacher && (
        <Panel className="wide-panel" icon={Plus} title="Publicar comunicado o anuncio">
          <form className="form-grid" onSubmit={onSubmit}>
            <input placeholder="Titulo" value={form.title} onChange={(event) => onChange({ ...form, title: event.target.value })} required />
            <select value={form.category} onChange={(event) => onChange({ ...form, category: event.target.value })}>
              <option value="COMUNICADO">Comunicado</option>
              <option value="ANUNCIO">Anuncio</option>
            </select>
            <select value={form.audience} onChange={(event) => onChange({ ...form, audience: event.target.value })}>
              <option value="STUDENT">Estudiantes</option>
              <option value="ALL">Todos</option>
            </select>
            <textarea placeholder="Mensaje" value={form.body} onChange={(event) => onChange({ ...form, body: event.target.value })} required />
            <button className="primary-button" disabled={status.loading} type="submit">Guardar publicaciÃ³n</button>
          </form>
        </Panel>
      )}
    </section>
  )
}

function DashboardView({ attendancePercent, courses, dashboard, isTeacher, semesterAverage }) {
  return (
    <>
      <div className="week-card">SEMANA 17</div>
      <section className="metric-grid">
        <Metric color="blue" icon={BookOpen} label={isTeacher ? 'Cursos activos' : 'Total asignaturas'} value={isTeacher ? dashboard.courses ?? 0 : courses.length} />
        <Metric color="green" icon={CheckCircle2} label="Asistencia general" value={`${Math.round(attendancePercent)}%`} />
        <Metric color="red" icon={Users} label={isTeacher ? 'Estudiantes' : 'Entregas'} value={isTeacher ? dashboard.students ?? 0 : dashboard.submissions ?? 0} />
        <Metric color="cyan" icon={GraduationCap} label="Promedio semestral" value={semesterAverage.toFixed(2)} />
      </section>
      <section className="dashboard-grid">
        <Panel title={isTeacher ? 'Cursos activos' : 'Mis cursos'} icon={BookOpen}>
          <CourseTable courses={courses} />
        </Panel>
        <Panel title="Mis asistencias" icon={ClipboardCheck}>
          <AttendanceBars courses={courses} />
        </Panel>
      </section>
    </>
  )
}

function ClassroomView({ assignments, assignmentForm, courses, handleSubmitHomework, isTeacher, lessonFile, lessonForm, lessons, onBack, onCreateAssignment, onCreateLesson, onOpenActivity, onSelectCourse, selectedActivity, selectedCourse, selectedFile, setAssignmentForm, setLessonFile, setLessonForm, setSelectedFile, setSubmissionForm, status, submissionForm, submissions }) {
  const [courseTab, setCourseTab] = useState('content')

  if (selectedActivity) {
    return (
      <ActivityDetail
        activity={selectedActivity}
        handleSubmitHomework={handleSubmitHomework}
        isTeacher={isTeacher}
        onBack={() => onOpenActivity(null)}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setSubmissionForm={setSubmissionForm}
        status={status}
        submissionForm={submissionForm}
        submissions={submissions}
      />
    )
  }

  if (!selectedCourse) {
    return (
      <section className="classroom-home">
        <div className="management-hero classroom-landing">
          <div>
            <span className="eyebrow">Aula virtual</span>
            <h3>Mis cursos</h3>
            <p>Entra a un curso para revisar semanas, materiales, videos, tareas y entregas.</p>
          </div>
          <div className="summary-chips">
            <span>{courses.length} cursos activos</span>
            <span>{lessons.length} materiales</span>
            <span>{assignments.length} tareas</span>
          </div>
        </div>
        <Panel className="wide-panel" icon={BookOpen} title="Mis cursos">
          <div className="section-intro">
            <h3>Vista general de cursos</h3>
            <p>Selecciona un curso para ver sus semanas, materiales, videos, tareas y entregas.</p>
          </div>
          <div className="course-browser">
            {courses.map((course, index) => (
              <button className="course-card" key={course.id} onClick={() => onSelectCourse(course.id)} type="button">
                <div className={`course-cover cover-${index % 5}`}>
                  <BookOpen size={34} />
                  <span>{course.code}</span>
                </div>
                <div className="course-card-body">
                  <strong>{course.name}</strong>
                  <span>I ciclo Â· Aula virtual</span>
                  <small>Ver clases, tareas y recursos</small>
                </div>
              </button>
            ))}
          </div>
        </Panel>
      </section>
    )
  }

  const courseLessons = lessons.filter((lesson) => lesson.course.id === selectedCourse.id)
  const courseAssignments = assignments.filter((assignment) => assignment.course.id === selectedCourse.id)
  const weeks = groupClassroomByWeek(courseLessons, courseAssignments)

  return (
    <section className="course-room">
      <button className="mini-button back-button" onClick={onBack} type="button">Volver a mis cursos</button>
      <div className="course-hero">
        <span>Aula virtual</span>
        <h2>{selectedCourse.name}</h2>
        <p>{selectedCourse.code} Â· Materiales, sesiones, tareas y entregas del curso.</p>
      </div>
      <div className="section-tabs course-tabs" aria-label="Secciones del aula virtual">
        <button className={courseTab === 'content' ? 'active' : ''} onClick={() => setCourseTab('content')} type="button"><BookOpen size={17} /> Contenido</button>
        {isTeacher && <button className={courseTab === 'manage' ? 'active' : ''} onClick={() => setCourseTab('manage')} type="button"><Upload size={17} /> Gestion docente</button>}
        {isTeacher && <button className={courseTab === 'submissions' ? 'active' : ''} onClick={() => setCourseTab('submissions')} type="button"><ClipboardCheck size={17} /> Entregas</button>}
      </div>

      {courseTab === 'content' && <Panel className="wide-panel" icon={BookOpen} title="General">
        <div className="activity-list">
          <button className="activity-item" type="button">
            <FileText size={20} />
            Avisos del curso
            <span>Indicaciones generales, enlaces y comunicados internos.</span>
          </button>
        </div>
      </Panel>}

      {isTeacher && courseTab === 'manage' && (
        <section className="teacher-tools-grid">
          <Panel icon={Upload} title="Crear material o sesion">
            <form className="stack-form" onSubmit={onCreateLesson}>
              <Field label="Titulo del material" help="Ejemplo: Clase 1 - Operaciones con fracciones.">
                <input placeholder="Escribe el titulo visible para estudiantes" value={lessonForm.title} onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })} required />
              </Field>
              <Field label="Indicaciones para el estudiante" help="Explica quÃ© debe revisar, resolver o tener listo antes de la clase.">
                <textarea placeholder="Indicaciones, comentarios o resumen para el estudiante" value={lessonForm.description} onChange={(event) => setLessonForm({ ...lessonForm, description: event.target.value })} required />
              </Field>
              <Field label="Tipo de material" help="Define cÃ³mo se mostrarÃ¡ el recurso dentro del aula.">
                <select value={lessonForm.materialType} onChange={(event) => setLessonForm({ ...lessonForm, materialType: event.target.value })}>
                  <option value="VIDEO">Video</option>
                  <option value="PDF">PDF / Documento</option>
                  <option value="IMAGE">Imagen</option>
                  <option value="LINK">Enlace</option>
                </select>
              </Field>
              <Field label="URL alternativa" help="Ãšsala si el video/material estÃ¡ en YouTube, Drive u otra plataforma. Si subes archivo, puedes dejarlo vacÃ­o.">
                <input placeholder="https://..." value={lessonForm.materialUrl} onChange={(event) => setLessonForm({ ...lessonForm, materialUrl: event.target.value })} />
              </Field>
              <Field label="Archivo adjunto" help="Puedes subir video, imagen, PDF o documento de apoyo.">
                <input accept="image/*,video/mp4,video/webm,application/pdf" onChange={(event) => setLessonFile(event.target.files[0] ?? null)} type="file" />
              </Field>
              {lessonFile && <small className="success-text">{lessonFile.name}</small>}
              <Field label="Semana del curso" help="Indica en quÃ© bloque aparecerÃ¡. Ejemplo: 1 = Semana 1, 2 = Semana 2.">
                <input min="1" type="number" value={lessonForm.weekNumber} onChange={(event) => setLessonForm({ ...lessonForm, weekNumber: Number(event.target.value) })} />
              </Field>
              <Field label="Duracion estimada" help="Tiempo aproximado en minutos que tomarÃ¡ revisar este material.">
                <input min="1" type="number" value={lessonForm.durationMinutes} onChange={(event) => setLessonForm({ ...lessonForm, durationMinutes: Number(event.target.value) })} />
              </Field>
              <button className="primary-button" type="submit">Publicar material</button>
            </form>
          </Panel>
          <Panel icon={ClipboardCheck} title="Crear tarea">
            <form className="stack-form" onSubmit={onCreateAssignment}>
              <Field label="Titulo de la tarea" help="Nombre que verÃ¡ el estudiante en el curso.">
                <input placeholder="Ejemplo: Practica 1 - Problemas de algebra" value={assignmentForm.title} onChange={(event) => setAssignmentForm({ ...assignmentForm, title: event.target.value })} required />
              </Field>
              <Field label="Indicaciones y criterios" help="Describe quÃ© debe entregar, formato esperado y cÃ³mo serÃ¡ evaluado.">
                <textarea placeholder="Indicaciones, criterios y comentarios del docente" value={assignmentForm.instructions} onChange={(event) => setAssignmentForm({ ...assignmentForm, instructions: event.target.value })} required />
              </Field>
              <Field label="Fecha y hora de inicio" help="Desde este momento el estudiante podra enviar la tarea. Incluye dia, hora, minuto y segundo.">
                <input step="1" type="datetime-local" value={assignmentForm.startAt} onChange={(event) => setAssignmentForm({ ...assignmentForm, startAt: event.target.value })} required />
              </Field>
              <Field label="Fecha y hora de fin" help="Despues de este momento la tarea queda fuera de plazo. Incluye dia, hora, minuto y segundo.">
                <input step="1" type="datetime-local" value={assignmentForm.endAt} onChange={(event) => setAssignmentForm({ ...assignmentForm, endAt: event.target.value })} required />
              </Field>
              <Field label="Puntaje maximo" help="Nota mÃ¡xima para esta tarea. Normalmente 20.">
                <input min="1" type="number" value={assignmentForm.maxScore} onChange={(event) => setAssignmentForm({ ...assignmentForm, maxScore: Number(event.target.value) })} required />
              </Field>
              <button className="primary-button" type="submit">Crear tarea</button>
            </form>
          </Panel>
        </section>
      )}

      {courseTab === 'content' && weeks.map((week) => (
        <Panel className="wide-panel" icon={CalendarDays} key={week.number} title={`Semana ${week.number}`}>
          <div className="activity-list">
            {week.items.map((item) => (
              <button className="activity-item" key={`${item.type}-${item.id}`} onClick={() => onOpenActivity(item)} type="button">
                {item.type === 'assignment' ? <ClipboardCheck size={20} /> : <FileText size={20} />}
                {item.title}
                <span>{item.type === 'assignment' ? `Tarea · ${formatDateTime(item.startAt)} hasta ${formatDateTime(item.endAt)}` : `${materialLabel(item.materialType)} · ${item.durationMinutes} min`}</span>
              </button>
            ))}
          </div>
        </Panel>
      ))}

      {isTeacher && courseTab === 'submissions' && (
        <Panel className="wide-panel" icon={ClipboardCheck} title="Entregas para revision">
          <SubmissionList submissions={submissions.filter((submission) => submission.assignment.course.id === selectedCourse.id)} />
        </Panel>
      )}
    </section>
  )
}

function ActivityDetail({ activity, handleSubmitHomework, isTeacher, onBack, selectedFile, setSelectedFile, setSubmissionForm, status, submissionForm, submissions }) {
  const isAssignment = activity.type === 'assignment'
  const activitySubmissions = isAssignment ? submissions.filter((submission) => submission.assignment.id === activity.id) : []

  return (
    <section className="activity-detail">
      <button className="mini-button" onClick={onBack} type="button">Volver al curso</button>
      <Panel className="wide-panel" icon={isAssignment ? ClipboardCheck : FileText} title={activity.title}>
        <div className="activity-summary">
          {isAssignment ? (
            <>
              <p><strong>Apertura:</strong> {formatDateTime(activity.startAt)}</p>
              <p><strong>Cierre:</strong> {formatDateTime(activity.endAt)}</p>
              <hr />
              <p>{activity.instructions}</p>
            </>
          ) : (
            <>
              <p><strong>Tipo:</strong> {materialLabel(activity.materialType)}</p>
              <p><strong>Duracion estimada:</strong> {activity.durationMinutes} minutos</p>
              <hr />
              <p>{activity.description}</p>
              <MaterialPreview activity={activity} />
            </>
          )}
        </div>
      </Panel>

      {isAssignment && !isTeacher && (
        <Panel className="wide-panel" icon={Upload} title="Enviar tarea">
          <form className="stack-form" onSubmit={(event) => handleSubmitHomework(event, activity.id)}>
            <input accept="image/*,video/mp4,video/webm,application/pdf" onChange={(event) => setSelectedFile(event.target.files[0] ?? null)} type="file" />
            {selectedFile && <small className="success-text">{selectedFile.name}</small>}
            <textarea placeholder="Comentario del estudiante" value={submissionForm.studentComment} onChange={(event) => setSubmissionForm({ ...submissionForm, assignmentId: activity.id, studentComment: event.target.value })} required />
            <button className="primary-button" disabled={status.loading} type="submit">Enviar entrega</button>
          </form>
        </Panel>
      )}

      {isAssignment && isTeacher && (
        <Panel className="wide-panel" icon={ClipboardCheck} title="Estado de entregas">
          <SubmissionList submissions={activitySubmissions} />
        </Panel>
      )}
    </section>
  )
}

function MaterialPreview({ activity }) {
  const url = activity.videoUrl?.startsWith('/uploads') ? mediaSrc(activity.videoUrl) : activity.videoUrl
  if (!url) return <p className="muted">Material sin archivo adjunto.</p>
  if (activity.materialType === 'VIDEO') {
    return url.includes('youtube') ? <iframe className="material-frame" src={url} title={activity.title} /> : <video className="material-frame" controls src={url} />
  }
  if (activity.materialType === 'IMAGE') {
    return <img alt={activity.title} className="material-image" src={url} />
  }
  return <a className="primary-button file-link" href={url} rel="noreferrer" target="_blank">Abrir material</a>
}

function AttendanceView({ attendance, attendanceSessionForm, attendanceSessions, courses, enrollments, isTeacher, onChangeSession, onCreateSession, onMarkStudent, onMarkTeacher, progress, student, studentAttendance, user }) {
  if (!isTeacher) {
    const studentSessions = attendanceSessions.filter((session) => enrollments.some((enrollment) => enrollment.course.id === session.course.id))
    return (
      <section className="attendance-layout">
        <Panel className="wide-panel" icon={ClipboardCheck} title="Asistencia estudiante">
          <div className="attendance-student-head">
            <div>
              <InfoRow label="Estudiante" value={user.displayName} />
              <InfoRow label="DNI" value={student?.documentNumber ?? 'Pendiente'} />
              <InfoRow label="Programa" value="Reforzamiento academico preuniversitario" />
              <InfoRow label="Ciclo" value="Verano 2026" />
            </div>
            <div className="profile-photo mini">
              {user.profilePhotoUrl ? <img alt={`Foto de ${user.displayName}`} src={mediaSrc(user.profilePhotoUrl)} /> : <span>{initials(user.displayName)}</span>}
            </div>
          </div>
          <AttendanceReport sessions={studentSessions} records={studentAttendance} courses={progress} />
        </Panel>
        <Panel className="wide-panel" icon={CheckCircle2} title="Marcar asistencia disponible">
          <div className="attendance-actions">
            {studentSessions.length === 0 && <p className="muted">Aun no hay sesiones de asistencia creadas por el docente.</p>}
            {studentSessions.map((session) => {
              const record = studentAttendance.find((item) => item.sessionId === session.id)
              return (
                <button disabled={Boolean(record)} key={session.id} onClick={() => onMarkStudent(session)} type="button">
                  <CheckCircle2 size={18} />
                  {session.course.code} - {session.title} S{session.weekNumber}
                  {record && <span className={`pill ${record.status.toLowerCase()}`}>{statusLetter(record.status)}</span>}
                </button>
              )
            })}
          </div>
        </Panel>
      </section>
    )
  }
  return (
    <section className="attendance-layout">
      <Panel icon={Plus} title="Crear sesion de asistencia">
        <form className="stack-form" onSubmit={onCreateSession}>
          <Field label="Curso" help="Selecciona el curso donde se abrirÃ¡ el control de asistencia.">
            <select value={attendanceSessionForm.courseId} onChange={(event) => onChangeSession({ ...attendanceSessionForm, courseId: event.target.value })} required>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}
            </select>
          </Field>
          <Field label="Nombre de la clase" help="Ejemplo: Clase 1 - Ecuaciones lineales. Este nombre serÃ¡ visible para estudiantes.">
            <input placeholder="Nombre de la clase o control" value={attendanceSessionForm.title} onChange={(event) => onChangeSession({ ...attendanceSessionForm, title: event.target.value })} required />
          </Field>
          <Field label="Fecha de clase" help="Fecha en la que se dictarÃ¡ o se dictÃ³ la clase.">
            <input type="date" value={attendanceSessionForm.sessionDate} onChange={(event) => onChangeSession({ ...attendanceSessionForm, sessionDate: event.target.value })} required />
          </Field>
          <Field label="Numero de sesion" help="Sirve para ordenar el reporte: 1 = S1, 2 = S2, 3 = S3. No uses 0.">
            <input min="1" placeholder="Ejemplo: 1" type="number" value={attendanceSessionForm.weekNumber} onChange={(event) => onChangeSession({ ...attendanceSessionForm, weekNumber: Number(event.target.value) })} required />
          </Field>
          <button className="primary-button" type="submit">Crear sesion</button>
        </form>
      </Panel>
      <Panel icon={ClipboardCheck} title="Sesiones creadas">
        <div className="session-list">
          {attendanceSessions.length === 0 && <p className="muted">Aun no hay sesiones creadas.</p>}
          {attendanceSessions.map((session) => <span className="session-chip" key={session.id}>S{session.weekNumber} Â· {session.course.code} Â· {session.sessionDate}</span>)}
        </div>
      </Panel>
      <Panel className="wide-panel" icon={ClipboardCheck} title="Registro de asistencia por sesion">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Estudiante</th><th>Curso</th><th>Sesion</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {enrollments.map((enrollment) => {
                const session = latestSessionForCourse(attendanceSessions, enrollment.course.id)
                const record = session ? attendance.find((item) => item.student.id === enrollment.student.id && item.sessionId === session.id) : null
                const status = record?.status ?? 'PENDING'
                return (
                <tr key={enrollment.id}>
                  <td>{enrollment.student.firstName} {enrollment.student.lastName}</td>
                  <td>{enrollment.course.code}</td>
                  <td>{session ? `S${session.weekNumber} - ${session.sessionDate}` : 'Sin sesion'}</td>
                  <td><span className={`pill ${status.toLowerCase()}`}>{status}</span></td>
                  <td>
                    <button className="mini-button" disabled={!session} onClick={() => onMarkTeacher(enrollment.student.id, session, 'PRESENT')} type="button">Presente</button>
                    <button className="mini-button danger" disabled={!session} onClick={() => onMarkTeacher(enrollment.student.id, session, 'ABSENT')} type="button">Ausente</button>
                  </td>
                </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </section>
  )
}

function AttendanceReport({ courses, records, sessions }) {
  const sessionColumns = sessions.slice(0, 16)
  return (
    <div className="table-wrap">
      <table className="attendance-report">
        <thead>
          <tr>
            <th>Ciclo</th><th>Turno</th><th>Seccion</th><th>Codigo</th><th>Asignatura</th>
            {sessionColumns.map((session) => <th key={session.id}>S{session.weekNumber}</th>)}
            <th>% faltas</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => {
            const courseId = course.courseId ?? course.id
            const courseSessions = sessionColumns.filter((session) => session.course.id === courseId)
            const absences = courseSessions.filter((session) => records.some((record) => record.sessionId === session.id && record.status === 'ABSENT')).length
            const absencePercent = courseSessions.length ? (absences * 100) / courseSessions.length : 0
            return (
              <tr key={courseId}>
                <td>I</td><td>Academia</td><td>A</td><td>{course.code}</td><td>{course.name}</td>
                {sessionColumns.map((session) => {
                  const record = session.course.id === courseId ? records.find((item) => item.sessionId === session.id) : null
                  return <td key={session.id}>{record ? statusLetter(record.status) : ''}</td>
                })}
                <td>{absencePercent.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function StudentsView({ courseForm, courses, editingStudent, enrollmentForm, enrollments, form, onCancelEdit, onChange, onChangeCourse, onChangeEnrollment, onEditStudent, onSaveStudent, onSubmit, onSubmitCourse, onSubmitEnrollment, query, setQuery, setStudentView, studentView, students }) {
  const [section, setSection] = useState('students')

  return (
    <section className="management-page">
      <div className="management-hero">
        <div>
          <span className="eyebrow">Administracion academica</span>
          <h3>Cuentas, cursos y matriculas</h3>
          <p>Lo separamos por bloques para que no tengas todo amontonado en una sola pantalla.</p>
        </div>
        <div className="summary-chips">
          <span>{students.length} estudiantes</span>
          <span>{courses.length} cursos</span>
          <span>{enrollments.length} matriculas</span>
        </div>
      </div>

      <div className="section-tabs" aria-label="Secciones de gestion">
        <button className={section === 'students' ? 'active' : ''} onClick={() => setSection('students')} type="button"><Users size={17} /> Estudiantes</button>
        <button className={section === 'courses' ? 'active' : ''} onClick={() => setSection('courses')} type="button"><BookOpen size={17} /> Cursos</button>
        <button className={section === 'enrollments' ? 'active' : ''} onClick={() => setSection('enrollments')} type="button"><GraduationCap size={17} /> Matriculas</button>
      </div>

      {section === 'students' && (
      <Panel icon={Plus} title="Crear estudiante">
        <form className="stack-form" onSubmit={onSubmit}>
          <div className="form-section-title">Datos del estudiante</div>
          <input placeholder="Nombres" value={form.firstName} onChange={(event) => onChange({ ...form, firstName: event.target.value })} required />
          <input placeholder="Apellidos" value={form.lastName} onChange={(event) => onChange({ ...form, lastName: event.target.value })} required />
          <input placeholder="Usuario de acceso" value={form.username} onChange={(event) => onChange({ ...form, username: event.target.value })} required />
          <input placeholder="Correo" type="email" value={form.email} onChange={(event) => onChange({ ...form, email: event.target.value })} required />
          <input placeholder="DNI" value={form.documentNumber} onChange={(event) => onChange({ ...form, documentNumber: event.target.value })} required />
          <input placeholder="Telefono" value={form.phone} onChange={(event) => onChange({ ...form, phone: event.target.value })} />
          <input placeholder="Contrasena" value={form.password} onChange={(event) => onChange({ ...form, password: event.target.value })} required />
          <div className="form-section-title">Datos del apoderado</div>
          <input placeholder="Nombre del apoderado" value={form.guardianName} onChange={(event) => onChange({ ...form, guardianName: event.target.value })} />
          <input placeholder="Telefono del apoderado" value={form.guardianPhone} onChange={(event) => onChange({ ...form, guardianPhone: event.target.value })} />
          <input placeholder="Parentesco: madre, padre, tutor..." value={form.guardianRelationship} onChange={(event) => onChange({ ...form, guardianRelationship: event.target.value })} />
          <div className="form-section-title">Segundo apoderado opcional</div>
          <input placeholder="Nombre del segundo apoderado" value={form.secondGuardianName} onChange={(event) => onChange({ ...form, secondGuardianName: event.target.value })} />
          <input placeholder="Telefono del segundo apoderado" value={form.secondGuardianPhone} onChange={(event) => onChange({ ...form, secondGuardianPhone: event.target.value })} />
          <input placeholder="Parentesco del segundo apoderado" value={form.secondGuardianRelationship} onChange={(event) => onChange({ ...form, secondGuardianRelationship: event.target.value })} />
          <button className="primary-button" type="submit">Crear estudiante</button>
        </form>
      </Panel>
      )}
      {section === 'courses' && (
      <Panel icon={BookOpen} title="Registrar curso">
        <form className="stack-form" onSubmit={onSubmitCourse}>
          <Field label="Codigo del curso / aula" help="Ejemplo: ARI-001, ALG-001 o AULA-A. Debe ser unico.">
            <input placeholder="Codigo" value={courseForm.code} onChange={(event) => onChangeCourse({ ...courseForm, code: event.target.value })} required />
          </Field>
          <Field label="Nombre del curso" help="Nombre visible para el estudiante y el admin.">
            <input placeholder="Nombre del curso" value={courseForm.name} onChange={(event) => onChangeCourse({ ...courseForm, name: event.target.value })} required />
          </Field>
          <Field label="Responsable" help="Puedes colocar el admin docente o la academia.">
            <input placeholder="Responsable" value={courseForm.teacher} onChange={(event) => onChangeCourse({ ...courseForm, teacher: event.target.value })} required />
          </Field>
          <button className="primary-button" type="submit">Registrar curso</button>
        </form>
      </Panel>
      )}
      {section === 'enrollments' && (
      <Panel icon={GraduationCap} title="Matricular estudiante en curso">
        <form className="stack-form" onSubmit={onSubmitEnrollment}>
          <Field label="Estudiante" help="Selecciona el alumno que serÃ¡ inscrito en el curso.">
            <select value={enrollmentForm.studentId} onChange={(event) => onChangeEnrollment({ ...enrollmentForm, studentId: event.target.value })} required>
              <option value="" disabled>Selecciona estudiante</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.firstName} {student.lastName} - {student.documentNumber}</option>)}
            </select>
          </Field>
          <Field label="Curso" help="Curso donde quedarÃ¡ matriculado el estudiante.">
            <select value={enrollmentForm.courseId} onChange={(event) => onChangeEnrollment({ ...enrollmentForm, courseId: event.target.value })} required>
              <option value="" disabled>Selecciona curso</option>
              {courses.map((course) => <option key={course.id} value={course.id}>{course.code} - {course.name}</option>)}
            </select>
          </Field>
          <button className="primary-button" type="submit">Matricular estudiante</button>
        </form>
      </Panel>
      )}
      {section === 'students' && editingStudent && (
        <Panel icon={IdCard} title="Editar datos del estudiante">
          <form className="stack-form" onSubmit={onSaveStudent}>
            <input placeholder="Nombres" value={editingStudent.firstName} onChange={(event) => onEditStudent({ ...editingStudent, firstName: event.target.value })} required />
            <input placeholder="Apellidos" value={editingStudent.lastName} onChange={(event) => onEditStudent({ ...editingStudent, lastName: event.target.value })} required />
            <input placeholder="Correo" type="email" value={editingStudent.email} onChange={(event) => onEditStudent({ ...editingStudent, email: event.target.value })} required />
            <input placeholder="DNI" value={editingStudent.documentNumber} onChange={(event) => onEditStudent({ ...editingStudent, documentNumber: event.target.value })} required />
            <div className="form-section-title">Datos del apoderado</div>
            <input placeholder="Nombre del apoderado" value={editingStudent.guardianName ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, guardianName: event.target.value })} />
            <input placeholder="Telefono del apoderado" value={editingStudent.guardianPhone ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, guardianPhone: event.target.value })} />
            <input placeholder="Parentesco" value={editingStudent.guardianRelationship ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, guardianRelationship: event.target.value })} />
            <div className="form-section-title">Segundo apoderado opcional</div>
            <input placeholder="Nombre del segundo apoderado" value={editingStudent.secondGuardianName ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, secondGuardianName: event.target.value })} />
            <input placeholder="Telefono del segundo apoderado" value={editingStudent.secondGuardianPhone ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, secondGuardianPhone: event.target.value })} />
            <input placeholder="Parentesco del segundo apoderado" value={editingStudent.secondGuardianRelationship ?? ''} onChange={(event) => onEditStudent({ ...editingStudent, secondGuardianRelationship: event.target.value })} />
            <div className="button-row">
              <button className="primary-button" type="submit">Guardar cambios</button>
              <button className="mini-button" onClick={onCancelEdit} type="button">Cancelar</button>
            </div>
          </form>
        </Panel>
      )}
      {(section === 'students' || section === 'enrollments') && (
      <Panel icon={Users} title={section === 'enrollments' ? 'Matriculados y apoderados' : 'Estudiantes registrados'}>
        <div className="toolbar">
          <label><Search size={16} /><input placeholder="Buscar estudiante, DNI o apoderado" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
          <button className="ghost-button" onClick={() => setStudentView(studentView === 'list' ? 'grid' : 'list')} type="button">
            {studentView === 'list' ? <LayoutGrid size={18} /> : <List size={18} />}
          </button>
        </div>
        {studentView === 'grid' ? <StudentCards onEditStudent={onEditStudent} students={students} /> : <StudentTable enrollments={enrollments} onEditStudent={onEditStudent} students={students} />}
      </Panel>
      )}
      {section === 'courses' && (
      <Panel icon={BookOpen} title="Cursos registrados">
        <CourseAdminTable courses={courses} enrollments={enrollments} />
      </Panel>
      )}
    </section>
  )
}

function CourseAdminTable({ courses, enrollments }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Codigo curso/aula</th><th>Curso</th><th>Responsable</th><th>Matriculados</th></tr></thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td>{course.code}</td>
              <td>{course.name}</td>
              <td>{course.teacher}</td>
              <td>{enrollments.filter((enrollment) => enrollment.course.id === course.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Panel({ children, className = '', icon: Icon, title }) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        {Icon && <Icon size={19} />}
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  )
}

function NoticeList({ notices, onDelete, onEdit, user }) {
  return (
    <div className="notice-list">
      {notices.length === 0 && <p className="muted">Sin publicaciones por ahora.</p>}
      {notices.map((notice) => (
        <article className="notice-card" key={notice.id}>
          <div><strong>{notice.title}</strong><p>{notice.body}</p><small>{notice.createdBy}</small></div>
          {canManageAnnouncement(notice, user) && (
            <div className="notice-actions">
              <button className="mini-button" onClick={() => onEdit(notice)} type="button">Editar</button>
              <button className="mini-button danger" onClick={() => onDelete(notice.id)} type="button">Borrar</button>
            </div>
          )}
        </article>
      ))}
    </div>
  )
}

function Metric({ color, icon: Icon, label, value }) {
  return (
    <article className={`stat-card ${color}`}>
      <div><strong>{value}</strong><span>{label}</span></div>
      <Icon size={48} />
    </article>
  )
}

function CourseTable({ courses }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>#</th><th>Asignatura</th><th>Progreso</th><th>Promedio</th></tr></thead>
        <tbody>
          {courses.map((course, index) => (
            <tr key={course.courseId ?? course.id}>
              <td>{index + 1}</td>
              <td>{course.name}</td>
              <td><div className="progress"><span style={{ width: `${course.progress ?? 100}%` }}>{course.progress ?? 100}%</span></div></td>
              <td className="score">{course.averageScore?.toFixed?.(0) ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function AttendanceBars({ courses }) {
  return (
    <div className="bars">
      {courses.map((course) => (
        <div className="bar-row" key={course.courseId ?? course.id}>
          <span>{course.code}</span>
          <div><i style={{ width: `${course.attendancePercent ?? 0}%` }}>{Math.round(course.attendancePercent ?? 0)}%</i></div>
        </div>
      ))}
    </div>
  )
}

function LessonLibrary({ lessonsByCourse }) {
  return (
    <div className="lesson-list">
      {Object.entries(lessonsByCourse).map(([code, courseLessons]) => (
        <article key={code}>
          <strong>{code} - {courseLessons[0].course.name}</strong>
          {courseLessons.map((lesson) => <small key={lesson.id}>{lesson.sequence}. {lesson.title} Â· {lesson.durationMinutes} min</small>)}
        </article>
      ))}
    </div>
  )
}

function SubmissionList({ submissions }) {
  return (
    <div className="submission-list">
      {submissions.length === 0 && <p className="muted">Aun no hay entregas.</p>}
      {submissions.map((submission) => (
        <article key={submission.id}>
          <strong>{submission.student.firstName} {submission.student.lastName} - {submission.assignment.title}</strong>
          <p>{submission.aiFeedback}</p>
          <a href={`http://localhost:8081${submission.artifactUrl}`} rel="noreferrer" target="_blank">{submission.artifactName}</a>
          <span>{submission.score}/{submission.assignment.maxScore} pts</span>
        </article>
      ))}
    </div>
  )
}

function StudentTable({ enrollments, onEditStudent, students }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Estudiante</th><th>DNI</th><th>Email</th><th>Apoderado principal</th><th>Segundo apoderado</th><th>Matriculas</th><th>Acciones</th></tr></thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.firstName} {student.lastName}</td>
              <td>{student.documentNumber}</td>
              <td>{student.email}</td>
              <td>{student.guardianName || 'Pendiente'}<br /><small>{student.guardianPhone || 'Sin telefono'}</small></td>
              <td>{student.secondGuardianName || 'Opcional'}<br /><small>{student.secondGuardianPhone || 'Sin telefono'}</small></td>
              <td>{enrollments.filter((enrollment) => enrollment.student.id === student.id).length}</td>
              <td><button className="mini-button" onClick={() => onEditStudent(student)} type="button">Editar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StudentCards({ onEditStudent, students }) {
  return (
    <div className="student-cards">
      {students.map((student) => (
        <article key={student.id}>
          <div className="avatar">{initials(`${student.firstName} ${student.lastName}`)}</div>
          <strong>{student.firstName} {student.lastName}</strong>
          <small>{student.documentNumber}</small>
          <span>{student.email}</span>
          <span>Apoderado: {student.guardianName || 'Pendiente'}</span>
          <span>Tel: {student.guardianPhone || 'Pendiente'}</span>
          {student.secondGuardianName && <span>2do apoderado: {student.secondGuardianName}</span>}
          {student.secondGuardianPhone && <span>Tel 2: {student.secondGuardianPhone}</span>}
          <button className="mini-button" onClick={() => onEditStudent(student)} type="button">Editar</button>
        </article>
      ))}
    </div>
  )
}

function BrandLogo({ compact = false }) {
  return (
    <img
      alt="Jose Pisconte Reforzamiento Academico"
      className={compact ? 'brand-logo compact' : 'brand-logo'}
      src="/brand/logo-jose-pisconte.png"
    />
  )
}

function groupBy(items, keyGetter) {
  return items.reduce((groups, item) => ({ ...groups, [keyGetter(item)]: [...(groups[keyGetter(item)] ?? []), item] }), {})
}

function groupClassroomByWeek(lessons, assignments) {
  const items = [
    ...lessons.map((lesson) => ({ ...lesson, type: 'lesson', weekNumber: lesson.weekNumber ?? lesson.sequence ?? 1 })),
    ...assignments.map((assignment, index) => ({ ...assignment, type: 'assignment', weekNumber: index + 1 })),
  ]
  const weeks = groupBy(items, (item) => item.weekNumber)
  return Object.entries(weeks)
    .map(([number, weekItems]) => ({ number: Number(number), items: weekItems }))
    .sort((left, right) => left.number - right.number)
}

function materialLabel(type) {
  return ({
    VIDEO: 'Video',
    PDF: 'PDF / Documento',
    IMAGE: 'Imagen',
    LINK: 'Enlace',
  })[type] ?? 'Material'
}

function formatDateTime(value) {
  if (!value) return 'Sin programar'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function average(values) {
  if (!values.length) return 0
  return values.reduce((sum, value) => sum + Number(value), 0) / values.length
}

function initials(name) {
  return name.split(' ').slice(0, 2).map((part) => part[0]).join('').toUpperCase()
}

function titleFor(view) {
  return ({ home: 'Inicio', dashboard: 'Dashboard', account: 'Mi cuenta', classroom: 'Aula virtual', attendance: 'Asistencia', students: 'Cuentas y matriculados' })[view]
}

function typeFromContent(contentType) {
  if (contentType.startsWith('image/')) return 'PHOTO'
  if (contentType.startsWith('video/')) return 'VIDEO'
  return 'DOCUMENT'
}

function isTeachingRole(role) {
  return role === 'ADMIN'
}

function roleLabel(role) {
  return ({
    STUDENT: 'Estudiante',
    ADMIN: 'Admin docente',
  })[role] ?? 'Usuario'
}

function canSeeAnnouncement(item, role) {
  if (item.audience === 'ALL' || item.audience === role) return true
  if (role === 'ADMIN') return true
  return false
}

function canManageAnnouncement(item, user) {
  if (!isTeachingRole(user?.role)) return false
  if (user.role === 'ADMIN') return true
  return item.createdByUsername === user.username
}

function mediaSrc(path, version = '') {
  if (!path) return ''
  const base = path.startsWith('http') ? path : `${MEDIA_URL}${path}`
  return version ? `${base}?v=${version}` : base
}

function latestSessionForCourse(sessions, courseId) {
  return [...sessions].reverse().find((item) => item.course.id === courseId)
}

function statusLetter(status) {
  if (status === 'PRESENT') return 'A'
  if (status === 'ABSENT') return 'F'
  return ''
}

LoginScreen.propTypes = { form: PropTypes.object.isRequired, onChange: PropTypes.func.isRequired, onLogin: PropTypes.func.isRequired, status: PropTypes.object.isRequired }
Sidebar.propTypes = { activeView: PropTypes.string.isRequired, isAdmin: PropTypes.bool.isRequired, onNavigate: PropTypes.func.isRequired, user: PropTypes.object.isRequired }
Topbar.propTypes = { activeView: PropTypes.string.isRequired, logout: PropTypes.func.isRequired, refresh: PropTypes.func.isRequired, status: PropTypes.object.isRequired, user: PropTypes.object.isRequired }
AccountView.propTypes = { courses: PropTypes.array.isRequired, dashboard: PropTypes.object.isRequired, onNavigate: PropTypes.func.isRequired, onPhotoChange: PropTypes.func.isRequired, photoVersion: PropTypes.number.isRequired, progress: PropTypes.array.isRequired, student: PropTypes.object, user: PropTypes.object.isRequired }
UserAvatar.propTypes = { user: PropTypes.object.isRequired }
InfoRow.propTypes = { badge: PropTypes.bool, label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired }
Field.propTypes = { children: PropTypes.node.isRequired, help: PropTypes.string, label: PropTypes.string.isRequired }
HomeView.propTypes = { announcements: PropTypes.array.isRequired, form: PropTypes.object.isRequired, isTeacher: PropTypes.bool.isRequired, onChange: PropTypes.func.isRequired, onDelete: PropTypes.func.isRequired, onEdit: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired, status: PropTypes.object.isRequired, user: PropTypes.object.isRequired }
DashboardView.propTypes = { attendancePercent: PropTypes.number.isRequired, courses: PropTypes.array.isRequired, dashboard: PropTypes.object.isRequired, isTeacher: PropTypes.bool.isRequired, semesterAverage: PropTypes.number.isRequired }
ClassroomView.propTypes = { assignments: PropTypes.array.isRequired, assignmentForm: PropTypes.object.isRequired, courses: PropTypes.array.isRequired, handleSubmitHomework: PropTypes.func.isRequired, isTeacher: PropTypes.bool.isRequired, lessonFile: PropTypes.object, lessonForm: PropTypes.object.isRequired, lessons: PropTypes.array.isRequired, onBack: PropTypes.func.isRequired, onCreateAssignment: PropTypes.func.isRequired, onCreateLesson: PropTypes.func.isRequired, onOpenActivity: PropTypes.func.isRequired, onSelectCourse: PropTypes.func.isRequired, selectedActivity: PropTypes.object, selectedCourse: PropTypes.object, selectedFile: PropTypes.object, setAssignmentForm: PropTypes.func.isRequired, setLessonFile: PropTypes.func.isRequired, setLessonForm: PropTypes.func.isRequired, setSelectedFile: PropTypes.func.isRequired, setSubmissionForm: PropTypes.func.isRequired, status: PropTypes.object.isRequired, submissionForm: PropTypes.object.isRequired, submissions: PropTypes.array.isRequired }
ActivityDetail.propTypes = { activity: PropTypes.object.isRequired, handleSubmitHomework: PropTypes.func.isRequired, isTeacher: PropTypes.bool.isRequired, onBack: PropTypes.func.isRequired, selectedFile: PropTypes.object, setSelectedFile: PropTypes.func.isRequired, setSubmissionForm: PropTypes.func.isRequired, status: PropTypes.object.isRequired, submissionForm: PropTypes.object.isRequired, submissions: PropTypes.array.isRequired }
MaterialPreview.propTypes = { activity: PropTypes.object.isRequired }
AttendanceView.propTypes = { attendance: PropTypes.array.isRequired, attendanceSessionForm: PropTypes.object.isRequired, attendanceSessions: PropTypes.array.isRequired, courses: PropTypes.array.isRequired, enrollments: PropTypes.array.isRequired, isTeacher: PropTypes.bool.isRequired, onChangeSession: PropTypes.func.isRequired, onCreateSession: PropTypes.func.isRequired, onMarkStudent: PropTypes.func.isRequired, onMarkTeacher: PropTypes.func.isRequired, progress: PropTypes.array.isRequired, student: PropTypes.object, studentAttendance: PropTypes.array.isRequired, user: PropTypes.object.isRequired }
AttendanceReport.propTypes = { courses: PropTypes.array.isRequired, records: PropTypes.array.isRequired, sessions: PropTypes.array.isRequired }
StudentsView.propTypes = { courseForm: PropTypes.object.isRequired, courses: PropTypes.array.isRequired, editingStudent: PropTypes.object, enrollmentForm: PropTypes.object.isRequired, enrollments: PropTypes.array.isRequired, form: PropTypes.object.isRequired, onCancelEdit: PropTypes.func.isRequired, onChange: PropTypes.func.isRequired, onChangeCourse: PropTypes.func.isRequired, onChangeEnrollment: PropTypes.func.isRequired, onEditStudent: PropTypes.func.isRequired, onSaveStudent: PropTypes.func.isRequired, onSubmit: PropTypes.func.isRequired, onSubmitCourse: PropTypes.func.isRequired, onSubmitEnrollment: PropTypes.func.isRequired, query: PropTypes.string.isRequired, setQuery: PropTypes.func.isRequired, setStudentView: PropTypes.func.isRequired, studentView: PropTypes.string.isRequired, students: PropTypes.array.isRequired }
CourseAdminTable.propTypes = { courses: PropTypes.array.isRequired, enrollments: PropTypes.array.isRequired }
Panel.propTypes = { children: PropTypes.node.isRequired, className: PropTypes.string, icon: PropTypes.elementType, title: PropTypes.string.isRequired }
NoticeList.propTypes = { notices: PropTypes.array.isRequired, onDelete: PropTypes.func.isRequired, onEdit: PropTypes.func.isRequired, user: PropTypes.object.isRequired }
Metric.propTypes = { color: PropTypes.string.isRequired, icon: PropTypes.elementType.isRequired, label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired }
CourseTable.propTypes = { courses: PropTypes.array.isRequired }
AttendanceBars.propTypes = { courses: PropTypes.array.isRequired }
LessonLibrary.propTypes = { lessonsByCourse: PropTypes.object.isRequired }
SubmissionList.propTypes = { submissions: PropTypes.array.isRequired }
StudentTable.propTypes = { enrollments: PropTypes.array.isRequired, onEditStudent: PropTypes.func.isRequired, students: PropTypes.array.isRequired }
StudentCards.propTypes = { onEditStudent: PropTypes.func.isRequired, students: PropTypes.array.isRequired }
BrandLogo.propTypes = { compact: PropTypes.bool }
