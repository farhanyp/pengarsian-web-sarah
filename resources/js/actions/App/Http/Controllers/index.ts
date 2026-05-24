import StudentController from './StudentController'
import SchoolClassController from './SchoolClassController'
import AcademicYearController from './AcademicYearController'
import StudentGradeController from './StudentGradeController'
import Settings from './Settings'
const Controllers = {
    StudentController: Object.assign(StudentController, StudentController),
SchoolClassController: Object.assign(SchoolClassController, SchoolClassController),
AcademicYearController: Object.assign(AcademicYearController, AcademicYearController),
StudentGradeController: Object.assign(StudentGradeController, StudentGradeController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers