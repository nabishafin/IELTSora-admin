export const defaultSettings = {
  profile: { name: "Admin User", email: "admin@example.com", role: "Super Admin", timezone: "UTC" },
  platform: { name: "IELTSora", supportEmail: "support@ieltsora.example", defaultTargetBand: "7.0", maintenanceMode: false },
  studyPlan: {
    allowFutureDays: false,
    unlockMode: "sequential",
    tasksRequiredPerDay: 4,
    defaultDurations: { reading: 45, listening: 30, writing: 40, speaking: 20 },
  },
  notifications: { newRegistrations: true, weeklyReport: true, inactiveStudents: true, contentPublished: false, systemAlerts: true },
};
