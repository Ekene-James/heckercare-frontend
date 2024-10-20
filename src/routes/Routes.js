import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Appointments from "../pages/appointments/Appointments";

import DischargeSummary from "../pages/patients/DischargeSummary";
import EmergencyPatients from "../pages/patients/EmergencyPatients";
import Admission from "../pages/patients/Admission";

import PatientsRegistration from "../pages/patients/PatientsRegistration";

import Staffs from "../pages/staffs/Staffs";

import Login from "../pages/login/Login";
import NoMatch from "../pages/noMatch/NoMatch";
import RecoverPassword from "../pages/recoverPassword/RecoverPassword";

import AuthenticatedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import Dashboard from "components/layouts/DashboardWrapper/Dashboard";
import DoctorsDashboard from "pages/dashboards/DoctorsDashboard";
import PatientsOverview from "pages/patients/PatientsOverview";
import PatientsHome from "pages/patients/singlePatientsHome/PatientsHome";
import BasicInformation from "pages/patients/singlePatientsHome/basicInformation/BasicInformation";
import MedicalRecords from "pages/patients/singlePatientsHome/medicalRecords/MedicalRecords";
import Treatments from "pages/patients/singlePatientsHome/treatments/Treatments";
import Prescriptions from "pages/patients/singlePatientsHome/prescription/Prescriptions";
import AddNewPrescription from "pages/patients/singlePatientsHome/prescription/AddNewPrescription";
import Investigations from "pages/patients/singlePatientsHome/investigations/Investigations";
import DoctorsAppointments from "pages/patients/singlePatientsHome/appointments/DoctorsAppointments";
import VisitDetails from "pages/patients/singlePatientsHome/visitDetails/VisitDetails";
import Profile from "pages/profile/Profile";
import StaffProfile from "pages/staffs/StaffProfile";
import StaffRegistration from "pages/staffs/StaffRegistration";
import ScheduleAppointment from "pages/appointments/ScheduleAppointment";
import FrontDesskDashboard from "pages/dashboards/FrontDesskDashboard";
import NurseDashboard from "pages/dashboards/NurseDashboard";
import LabOverview from "pages/lab/LabOverview";
import Departments from "pages/department/deptOverview/Departments";
import Department from "pages/department/deptOverview/Department";
import AdminDashboard from "pages/dashboards/AdminDashboard";
import Ward from "pages/department/ward/Ward";
import AllAppointments from "pages/dashboards/AllAppointments";
import AvailableDoctors from "pages/dashboards/AvailableDoctors";
import LabRequests from "pages/lab/LabRequests";
import TestCenter from "pages/lab/TestCenter";
import WardOverview from "pages/department/ward/WardOverview";
import StockManagement from "pages/lab/StockManagement";
import OverviewDashboard from "pages/inventory/Overview";
import InventoryCost from "pages/inventory/InventoryCost";
import InventoryItems from "pages/inventory/InventoryItems";
import StockMgt from "pages/inventory/StockMgt";
import DepartmentsInventory from "pages/inventory/DepartmentsInventory";

import AccountingOverview from "pages/accounting/Overview";
import TransactionDetail from "pages/accounting/TransactionDetail";
import PharmacyOverviewHome from "pages/pharmacy/overview";
import PharmacyStockManagement from "pages/pharmacy/stockManagement";
import StaffShift from "pages/staffs/StaffShift";
import InventorySummary from "pages/inventory/InventorySummary";
import InventoryRequisitionHistory from "pages/inventory/RequisitionHistory";
import UnitOverview from "pages/department/units/Overview";
import SingleUnit from "pages/department/units/Unit";
import ClinicOverview from "pages/department/clinic/ClinicOverview";
import SingleClinic from "pages/department/clinic/Clinic";
import EditStaff from "pages/staffs/EditStaff";
import EmergencyPatientsRegistration from "pages/patients/EmergencyPatientRegistration";
import RequisitionHistory from "pages/pharmacy/requisitionHistory/RequisitionHistory";
import DispensedDrugs from "pages/pharmacy/overview/DispensedDrugs";
import ExpiredDrugs from "pages/pharmacy/overview/ExpiredDrugs";
import VendorMgt from "pages/inventory/VendorMgt";
import TransactionHistory from "pages/inventory/TransactionHistory";
import ItemRequisitionHistory from "pages/inventory/ItemRequisitionHistory";

import AccountsRequisitions from "pages/accounting/Requistions";
import RequisitionDispute from "pages/accounting/RequisitionDispute";
import DisputeList from "pages/accounting/DisputeList";

import OpenDispute from "pages/accounting/OpenDispute";
import Reports from "pages/accounting/reports/Reports";
import StaffWards from "pages/staffs/StaffWards";
import DoctorsNote from "pages/dashboards/DoctorsNote";
import DoctorAppointmentHistory from "pages/dashboards/DoctorAppointmentHistory";
import Permissions from "pages/settings/permissions";
import ChangePassword from "pages/login/ChangePassword";
import ResetPassword from "pages/resetPassword/ResetPassword";
import EditPatient from "pages/patients/singlePatientsHome/EditPatient";
import { Landing } from "pages/landing/landing";
import TransactionTypes from "pages/accounting/TransactionTypes";
import Radiology from "pages/patients/singlePatientsHome/radiology/Radiology";
import RadioOverview from "pages/radiology/RadioOverview";
import RadioRequests from "pages/radiology/RadioRequests";
import RadioTestCenter from "pages/radiology/RadioTestCenter";
import RadioStockManagement from "pages/radiology/RadioStockManagement";
import ServiceReport from "pages/dashboards/ServiceReport";
import SampleStandards from "pages/settings/SampleStandards";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<PublicRoutes />}>
        <Route index element={<Login />} />

        <Route path="recover-password" element={<RecoverPassword />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
      </Route>

      {/* auth routes */}
      <Route path="/" element={<AuthenticatedRoutes />}>
        <Route path="/home" element={<Dashboard />}>
          <Route path="/home/profile" element={<Profile />} />
          {/*Dashboard components */}

          {/*doctor */}
          <Route
            path="/home/doctor"
            element={<Navigate to="/home/doctor/dashboard" replace />}
          />
          <Route path="/home/doctor/dashboard" element={<DoctorsDashboard />} />
          {/* doctors appointment history */}
          <Route
            path="/home/doctor/appointment-history"
            element={<DoctorAppointmentHistory />}
          />

          {/* front desk */}
          <Route
            path="/home/front-desk"
            element={<Navigate to="/home/front-desk/dashboard" replace />}
          />
          <Route
            path="/home/front-desk/dashboard"
            element={<FrontDesskDashboard />}
          />
          <Route
            path="/home/front-desk/dashboard/generate-service-report"
            element={<ServiceReport />}
          />
          {/* Nurse */}
          <Route
            path="/home/nurse"
            element={<Navigate to="/home/nurse/dashboard" replace />}
          />
          <Route path="/home/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/home/nurse/doctors-note" element={<DoctorsNote />} />

          {/* admin */}
          <Route
            path="/home/admin"
            element={<Navigate to="/home/admin/dashboard" replace />}
          />
          <Route path="/home/admin/dashboard" element={<AdminDashboard />} />

          {/* other dashboard pages */}
          <Route
            path="/home/dashboard/all-appointments"
            element={<AllAppointments />}
          />
          <Route
            path="/home/dashboard/available-doctors"
            element={<AvailableDoctors />}
          />

          {/* other sidebar routes i.e modules */}

          {/* patient module */}

          <Route
            path="/home/patients-overview"
            element={<PatientsOverview />}
          />
          <Route
            path="/home/patient/edit-patient/:id"
            element={<EditPatient />}
          />

          <Route path="/home/patient" element={<PatientsHome />}>
            <Route
              path="/home/patient"
              element={<Navigate to="/home/patient/basic-information/:id" />}
            />

            <Route
              path="/home/patient/basic-information/:id"
              element={<BasicInformation />}
            />
            <Route
              path="/home/patient/medical-records/:id"
              element={<MedicalRecords />}
            />
            <Route
              path="/home/patient/treatments/:id"
              element={<Treatments />}
            />
            <Route
              path="/home/patient/prescriptions/:id"
              element={<Prescriptions />}
            />
            <Route
              path="/home/patient/add-new-prescription"
              element={<AddNewPrescription />}
            />
            <Route
              path="/home/patient/investigations/:id"
              element={<Investigations />}
            />
            <Route path="/home/patient/radiology/:id" element={<Radiology />} />
            <Route
              path="/home/patient/appointments/:id"
              element={<DoctorsAppointments />}
            />
          </Route>
          <Route
            path="/home/patient/registration"
            element={<PatientsRegistration />}
          />
          <Route
            path="/home/emergency-patient-registration"
            element={<EmergencyPatientsRegistration />}
          />
          <Route
            path="/home/patient/visit_details/:patientId/:visitId"
            element={<VisitDetails />}
          />
          <Route
            path="/home/emergency-patient"
            element={<EmergencyPatients />}
          />
          <Route
            path="/home/patient-discharge-summary"
            element={<DischargeSummary />}
          />

          {/* admission module */}
          <Route path="/home/admission" element={<Admission />} />
          <Route path="/home/appointment" element={<Appointments />} />
          <Route
            path="/home/appointment/schedule-appointment"
            element={<ScheduleAppointment />}
          />

          {/* department module */}
          <Route path="/home/departments" element={<Departments />} />
          <Route path="/home/department/dept/:id" element={<Department />} />

          <Route path="/home/ward-overview" element={<WardOverview />} />
          <Route path="/home/department/ward/:id" element={<Ward />} />

          <Route path="/home/unit-overview" element={<UnitOverview />} />
          <Route path="/home/department/unit/:id" element={<SingleUnit />} />

          <Route path="/home/clinic-overview" element={<ClinicOverview />} />
          <Route
            path="/home/department/clinic/:id"
            element={<SingleClinic />}
          />

          {/* staff module */}
          <Route path="/home/all-staffs" element={<Staffs />} />
          <Route path="/home/staff-shift" element={<StaffShift />} />
          <Route
            path="/home/staff/registration"
            element={<StaffRegistration />}
          />
          <Route path="/home/staff/:id" element={<StaffProfile />} />
          <Route path="/home/staff/edit/:id" element={<EditStaff />} />
          <Route path="/home/staff/wards" element={<StaffWards />} />

          {/* lab module */}
          <Route path="/home/laboratory-overview" element={<LabOverview />} />
          <Route
            path="/home/all-laboratory-requests"
            element={<LabRequests />}
          />
          <Route path="/home/laboratory-test-center" element={<TestCenter />} />
          <Route
            path="/home/laboratory-stock-management"
            element={<StockManagement />}
          />

          {/* radiology module */}
          <Route path="/home/radiology-overview" element={<RadioOverview />} />
          <Route
            path="/home/all-radiology-requests"
            element={<RadioRequests />}
          />
          <Route
            path="/home/radiology-test-center"
            element={<RadioTestCenter />}
          />
          <Route
            path="/home/radiology-stock-management"
            element={<RadioStockManagement />}
          />
          {/* inventory module */}

          <Route
            path="/home/inventory-overview"
            element={<OverviewDashboard />}
          />
          <Route path="/home/inventory-cost" element={<InventoryCost />} />
          <Route path="/home/inventory-items" element={<InventoryItems />} />
          <Route
            path="/home/inventory-stock-management"
            element={<StockMgt />}
          />
          <Route
            path="/home/inventory-items/transaction-history/:id"
            element={<TransactionHistory />}
          />
          <Route
            path="/home/inventory-items/requisition-history/:id"
            element={<ItemRequisitionHistory />}
          />

          <Route
            path="/home/inventory/summary/:id"
            element={<InventorySummary />}
          />
          <Route
            path="/home/inventory/requisition-history"
            element={<InventoryRequisitionHistory />}
          />
          <Route
            path="/home/inventory/vendor-management"
            element={<VendorMgt />}
          />
          <Route
            path="/home/inventory/departments/:department"
            element={<DepartmentsInventory />}
          />

          {/* Accounting module */}
          <Route
            path="/home/accounting-overview"
            element={<AccountingOverview />}
          />
          <Route
            path="/home/accounting-dispute-list"
            element={<DisputeList />}
          />
          <Route
            path="/home/accounting-open-dispute"
            element={<OpenDispute />}
          />

          <Route
            path="/home/transaction-details/:transactionId"
            element={<TransactionDetail />}
          />
          <Route
            path="/home/accounting/requisitions"
            element={<AccountsRequisitions />}
          />
          <Route
            path="/home/accounting/transaction-types"
            element={<TransactionTypes />}
          />
          <Route
            path="/home/accounting/requisition-dispute"
            element={<RequisitionDispute />}
          />
          <Route path="/home/accounting/report" element={<Reports />} />

          {/**Pharamcy module */}
          <Route
            path="/home/pharmacy-overview"
            element={<PharmacyOverviewHome />}
          />
          <Route
            path="/home/pharmacy-stock-management"
            element={<PharmacyStockManagement />}
          />
          <Route
            path="/home/pharmacy-requisition-history"
            element={<RequisitionHistory />}
          />
          <Route
            path="/home/pharmacy/dashboard/dispensed-request"
            element={<DispensedDrugs />}
          />
          <Route
            path="/home/pharmacy/dashboard/expired-drugs"
            element={<ExpiredDrugs />}
          />

          <Route path="/home/settings-permission" element={<Permissions />} />
          <Route
            path="/home/settings-sample-standards"
            element={<SampleStandards />}
          />

          <Route path="*" element={<NoMatch />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Route>

      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
}

export default AppRoutes;
