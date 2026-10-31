INSERT INTO app_users (email, password, display_name, role)
VALUES ('programador@josepisconte.test', '${demo-admin-password}', 'Administrador Demo', 'TEACHER');

INSERT INTO announcements (title, body, category, audience, created_by)
VALUES
    (
        'Taller de Matematicas Verano 2026',
        'Nuevo grupo inicia el 12 de enero. Incluye asesoria y seguimiento personalizado por estudiante.',
        'ANUNCIO',
        'ALL',
        'Coordinacion Academica'
    ),
    (
        'Horarios del taller de matematica',
        'Turno manana: 8:30 am a 10:00 am, 10:00 am a 11:30 am, 11:30 am a 1:00 pm. Turno tarde: 2:00 pm a 3:30 pm, 3:30 pm a 5:00 pm, 5:00 pm a 6:30 pm.',
        'COMUNICADO',
        'STUDENT',
        'Coordinacion Academica'
    ),
    (
        'Informacion de contacto',
        'Los datos de contacto se configuran fuera de esta demostracion publica.',
        'COMUNICADO',
        'ALL',
        'Coordinacion Academica'
    );
