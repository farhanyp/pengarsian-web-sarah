import StudentController from './StudentController'
import SchoolClassController from './SchoolClassController'
import AcademicYearController from './AcademicYearController'
import StudentGradeController from './StudentGradeController'
import SubjectController from './SubjectController'
import DocumentController from './DocumentController'
import UserController from './UserController'
import Settings from './Settings'
const Controllers = {
    StudentController: Object.assign(StudentController, StudentController),
SchoolClassController: Object.assign(SchoolClassController, SchoolClassController),
AcademicYearController: Object.assign(AcademicYearController, AcademicYearController),
StudentGradeController: Object.assign(StudentGradeController, StudentGradeController),
SubjectController: Object.assign(SubjectController, SubjectController),
DocumentController: Object.assign(DocumentController, DocumentController),
UserController: Object.assign(UserController, UserController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers