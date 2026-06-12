import StudentController from './StudentController'
import StudentGradeController from './StudentGradeController'
import DocumentController from './DocumentController'
import ClassTeacherController from './ClassTeacherController'
import SchoolClassController from './SchoolClassController'
import AcademicYearController from './AcademicYearController'
import SubjectController from './SubjectController'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    StudentController: Object.assign(StudentController, StudentController),
StudentGradeController: Object.assign(StudentGradeController, StudentGradeController),
DocumentController: Object.assign(DocumentController, DocumentController),
ClassTeacherController: Object.assign(ClassTeacherController, ClassTeacherController),
SchoolClassController: Object.assign(SchoolClassController, SchoolClassController),
AcademicYearController: Object.assign(AcademicYearController, AcademicYearController),
SubjectController: Object.assign(SubjectController, SubjectController),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers