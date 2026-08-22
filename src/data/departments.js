export const CENTRAL_DEPARTMENTS = [
  { id: 'railways', name: 'Ministry of Railways', code: 'MORLY', portalSection: 'Railway Board & Zonal Railways' },
  { id: 'telecom', name: 'Department of Telecommunications', code: 'DOTEL', portalSection: 'Telecom & BSNL/MTNL' },
  { id: 'financial_services', name: 'Department of Financial Services', code: 'DFS', portalSection: 'Public Sector Banks & Insurance' },
  { id: 'home_affairs', name: 'Ministry of Home Affairs', code: 'MHOME', portalSection: 'Central Armed Police & UTs' },
  { id: 'higher_education', name: 'Department of Higher Education', code: 'DHEDU', portalSection: 'Central Universities & IITs/NITs' },
  { id: 'health_fw', name: 'Ministry of Health and Family Welfare', code: 'MOHFW', portalSection: 'AIIMS & Central Health Services' },
  { id: 'posts', name: 'Department of Posts', code: 'DPOST', portalSection: 'India Post Operations' },
  { id: 'cbdt', name: 'Central Board of Direct Taxes (CBDT)', code: 'CBDT', portalSection: 'Income Tax Department' },
  { id: 'cbic', name: 'Central Board of Indirect Taxes and Customs (CBIC)', code: 'CBIC', portalSection: 'GST & Customs Authority' },
  { id: 'external_affairs', name: 'Ministry of External Affairs', code: 'MEA', portalSection: 'Passport Offices & Consular Services' },
  { id: 'ssc', name: 'Staff Selection Commission (SSC)', code: 'SSC', portalSection: 'Central Recruitment Exams' },
  { id: 'upsc', name: 'Union Public Service Commission (UPSC)', code: 'UPSC', portalSection: 'Civil Services Examination' },
  { id: 'road_transport', name: 'Ministry of Road Transport and Highways', code: 'MORTH', portalSection: 'National Highways & NHAI' },
  { id: 'housing_urban', name: 'Ministry of Housing and Urban Affairs', code: 'MOHUA', portalSection: 'CPWD & Central Housing Schemes' },
  { id: 'defence', name: 'Department of Defence', code: 'DDEF', portalSection: 'Armed Forces Headquarters' },
  { id: 'consumer_affairs', name: 'Department of Consumer Affairs', code: 'DOCA', portalSection: 'National Consumer Helpline' },
  { id: 'none', name: 'None / Other Department (Type Manually)', code: 'OTHER', portalSection: 'Type Custom Central Public Authority' }
];

export const SAMPLE_TEMPLATES = [
  {
    title: 'Status of Pending Application / Representation',
    text: `1. Provide the daily progress report and current status of my application/representation dated [Date] regarding [Brief Subject].
2. Provide the name, designation, and official contact details of the officer(s) with whom my file is currently pending.
3. Provide certified copies of all file notings, official correspondence, and decisions recorded on the aforementioned application.`
  },
  {
    title: 'Inspection of Public Work / Project Expenditure',
    text: `1. Provide certified details of total funds allocated and expenditure incurred for the public infrastructure project [Project Name] executed in [Location].
2. Provide copies of the work order, completion certificate, and quality inspection reports submitted by the contractor.
3. Specify date and venue for physical inspection of the work records under Section 2(j)(i) of the RTI Act 2005.`
  },
  {
    title: 'Recruitment & Examination Information',
    text: `1. Provide certified copy of my evaluated answer script / mark statement for [Exam Name] held on [Date] bearing Roll No: [Roll Number].
2. Provide the cut-off marks category-wise for selection in the aforementioned examination.
3. Provide total number of vacant posts advertised versus total candidates selected.`
  }
];
