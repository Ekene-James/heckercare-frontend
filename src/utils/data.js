import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";

import BiotechIcon from "@mui/icons-material/Biotech";
import InventoryIcon from "@mui/icons-material/Inventory";

import GroupIcon from "@mui/icons-material/Group";
import NightShelterIcon from "@mui/icons-material/NightShelter";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import MedicationLiquidOutlinedIcon from "@mui/icons-material/MedicationLiquidOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import ScienceIcon from "@mui/icons-material/Science";
import SettingsIcon from "@mui/icons-material/Settings";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ViewListIcon from "@mui/icons-material/ViewList";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SummarizeIcon from "@mui/icons-material/Summarize";
import HandshakeIcon from "@mui/icons-material/Handshake";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MedicationLiquidIcon from "@mui/icons-material/MedicationLiquid";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PaletteIcon from "@mui/icons-material/Palette";
export const sidebarData = [
  {
    link: "/home/doctor/dashboard",
    icon: <DashboardIcon />,
    text: "Dashboard",
    for: "doctor",
    subItem: [],
    subroutes: ["/home/doctor/appointment-history"],
    isRouteIncludes: "/home/ward/",
  },
  {
    link: "/home/admin/dashboard",
    icon: <DashboardIcon />,
    text: "Dashboard",
    for: "admin",
    subItem: [],
    subroutes: [],
  },

  {
    link: "/home/nurse/dashboard",
    icon: <DashboardIcon />,
    text: "Dashboard",
    for: "nurse",
    isRouteIncludes: "/home/nurse/doctors-note",
    subItem: [],
    subroutes: ["/home/nurse/doctors-note"],
  },
  {
    link: "/home/front-desk/dashboard",
    icon: <DashboardIcon />,
    text: "Dashboard",
    for: "front-desk",
    subItem: [],
    subroutes: [
      "/home/dashboard/all-appointments",
      "/home/dashboard/available-doctors",
      "/home/appointment/schedule-appointment",
      "/home/front-desk/dashboard/generate-service-report",
    ],
  },
  {
    link: "/home/appointment",
    icon: <CalendarMonthOutlinedIcon />,
    text: "Appointment",
    subroutes: [],
    subItem: [],
  },
  {
    icon: <NightShelterOutlinedIcon />,
    text: "PATIENT",
    isRouteIncludes: "/home/patient/",
    subroutes: [
      "/home/patients-overview",
      "/home/patient/registration",
      "/home/admission",
      "/home/emergency-patient",
      "/home/patient-discharge-summary",
      "/home/emergency-patient-registration",
    ],
    subItem: [
      {
        link: "/home/patients-overview",
        icon: <PersonAddAlt1OutlinedIcon />,
        text: "Patients Overview",
        isRouteIncludes: "/home/patient/",
      },

      {
        link: "/home/admission",
        icon: <MedicationLiquidOutlinedIcon />,
        text: "Admision",
      },
      {
        link: "/home/emergency-patient",
        icon: <WarningAmberOutlinedIcon />,
        text: "Emergency Patient",
        isRouteIncludes: "/home/emergency-patient-registration",
      },
      {
        link: "/home/patient-discharge-summary",
        icon: <AssignmentOutlinedIcon />,
        text: "Discharge Summary",
      },
    ],
  },
  {
    icon: <RoomPreferencesIcon />,
    text: "DEPARTMENT",
    isRouteIncludes: "/home/department/",
    subroutes: [
      "/home/departments",
      "/home/ward-overview",
      "/home/unit-overview",
      "/home/clinic-overview",
    ],
    subItem: [
      {
        link: "/home/departments",
        icon: <MeetingRoomIcon />,
        text: "Overview",
        isRouteIncludes: "/home/department/dept",
      },
      {
        link: "/home/clinic-overview",
        icon: <ApartmentIcon />,
        text: "Clinics",
        isRouteIncludes: "/home/department/clinic/",
      },
      {
        link: "/home/unit-overview",
        icon: <ApartmentIcon />,
        text: "Units",
        isRouteIncludes: "/home/department/unit/",
      },
      {
        link: "/home/ward-overview",
        icon: <NightShelterIcon />,
        text: "Ward&Bed",
        isRouteIncludes: "/home/department/ward/",
      },
    ],
  },
  {
    icon: <FormatListBulletedIcon />,
    text: "STAFF",
    isRouteIncludes: "/home/staff/",
    subroutes: [
      "/home/all-staffs",
      "/home/staff/registration",
      "/home/staff-shift",
      "/home/staff/wards",
    ],
    subItem: [
      {
        link: "/home/all-staffs",
        icon: <ListAltIcon />,
        text: "All Staffs",
        // isRouteIncludes: "/home/staff/",
      },
      {
        link: "/home/staff-shift",
        icon: <ViewListIcon />,
        text: "Staff Shift",
      },
      {
        link: "/home/staff/wards",
        icon: <NightShelterIcon />,
        text: "Staff Wards",
      },
    ],
  },
  {
    icon: <ScienceIcon />,
    text: "LABORATORY",
    subroutes: [
      "/home/laboratory-overview",
      "/home/laboratory-stock-management",
      "/home/laboratory-test-center",
      "/home/all-laboratory-requests",
    ],
    subItem: [
      {
        link: "/home/laboratory-overview",
        icon: <CalendarMonthIcon />,
        text: "Lab Overview",
        isRouteIncludes: "/home/all-laboratory-requests",
      },
      {
        link: "/home/laboratory-stock-management",
        icon: <InventoryIcon />,
        text: "Stock Management",
      },
      {
        link: "/home/laboratory-test-center",
        icon: <BiotechIcon />,
        text: "Test Center",
      },
    ],
  },
  {
    icon: <ScienceIcon />,
    text: "RADIOLOGY",
    subroutes: [
      "/home/radiology-overview",
      "/home/radiology-stock-management",
      "/home/radiology-test-center",
      "/home/all-radiology-requests",
    ],
    subItem: [
      {
        link: "/home/radiology-overview",
        icon: <CalendarMonthIcon />,
        text: "Overview",
        isRouteIncludes: "/home/all-radiology-requests",
      },
      {
        link: "/home/radiology-stock-management",
        icon: <InventoryIcon />,
        text: "Stock Management",
      },
      {
        link: "/home/radiology-test-center",
        icon: <BiotechIcon />,
        text: "Test Center",
      },
    ],
  },

  {
    icon: <MedicationLiquidIcon />,
    text: "PHARMACY",
    subroutes: [
      "/home/pharmacy-overview",
      "/home/pharmacy-stock-management",
      "/home/pharmacy-requisition-history",
      "/home/pharmacy/dashboard/expired-drugs",
      "/home/pharmacy/dashboard/dispensed-request",
    ],
    subItem: [
      {
        link: "/home/pharmacy-overview",
        icon: <DateRangeIcon />,
        text: "Overview",
      },
      {
        link: "/home/pharmacy-stock-management",
        icon: <DateRangeIcon />,
        text: "Stock Management",
      },

      {
        link: "/home/pharmacy-requisition-history",
        icon: <ContentPasteIcon />,
        text: "Requisition History",
      },
    ],
  },
  {
    icon: <InventoryIcon />,
    text: "INVENTORY",
    subroutes: [
      "/home/inventory-overview",
      "/home/inventory-purchase-order",
      "/home/inventory-stock-management",
      "/home/inventory-cost",
      "/home/inventory-items",
    ],
    isRouteIncludes: "/home/inventory",
    subItem: [
      {
        link: "/home/inventory-overview",
        icon: <SettingsIcon />,
        text: "Overview",
        isRouteIncludes: "/home/inventory-cost",
      },

      {
        link: "/home/inventory-stock-management",
        icon: <DateRangeIcon />,
        text: "Stock Management",
        isRouteIncludes: "/home/inventory/departments",
      },
      {
        link: "/home/inventory/requisition-history",
        icon: <ContentPasteIcon />,
        text: "Requisition",
        isRouteIncludes: "/home/inventory/requisition-history",
      },
      {
        link: "/home/inventory/vendor-management",
        icon: <ListAltIcon />,
        text: "Vendor Management",
      },
    ],
  },

  {
    icon: <RequestQuoteIcon />,
    text: "ACCOUNTING",
    subroutes: [
      "/home/accounting-overview",
      "/home/accounting/Requisition-dispute",
      "/home/accounting/requisitions",
      "/home/accounting-dispute-list",
      "/home/accounting/transaction-types",
      "/home/accounting-open-dispute",
      "/home/accounting/report",
    ],
    isRouteIncludes: "/home/transaction-details/",
    subItem: [
      {
        link: "/home/accounting-overview",
        icon: <DateRangeIcon />,
        text: "Overview",
        isRouteIncludes: "/home/transaction-details/",
      },
      {
        link: "/home/accounting/requisitions",
        icon: <SummarizeIcon />,
        text: "Requisitions",
      },
      {
        link: "/home/accounting/Requisition-dispute",
        icon: <HandshakeIcon />,
        text: "Requisition Dispute",
      },
      {
        link: "/home/accounting-dispute-list",
        icon: <ContentPasteIcon />,
        text: "Transaction Dispute",
      },
      {
        link: "/home/accounting/transaction-types",
        icon: <ReceiptLongIcon />,
        text: "Transaction Types",
      },
      {
        link: "/home/accounting-open-dispute",
        icon: <SettingsIcon />,
        text: "Open Dispute",
      },
      {
        link: "/home/accounting/report",
        icon: <InsertChartIcon />,
        text: "Report",
      },
    ],
  },

  {
    icon: <SettingsApplicationsIcon />,
    text: "SETTINGS",
    subroutes: ["/home/settings-permission", "/home/settings-sample-standards"],
    subItem: [
      // {
      //   link: "/home/settings-our-location",
      //   icon: <DateRangeIcon />,
      //   text: "Our Location",
      // },
      {
        link: "/home/settings-permission",
        icon: <ManageAccountsIcon />,
        text: "Permission",
      },
      {
        link: "/home/settings-sample-standards",
        icon: <PaletteIcon />,
        text: "Sample Standards",
      },
    ],
  },
];
