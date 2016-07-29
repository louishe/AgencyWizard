/**
 * Create Agency Script.
 */
var db = aa.env.getValue("db").toUpperCase();
var servProvCode = aa.env.getValue("servProvCode");
var jurisdiction = aa.env.getValue("jurisdiction");
var multiLangFlag = aa.env.getValue("multiLangFlag");
var agencyName = aa.env.getValue("agencyName");
var zip = aa.env.getValue("zip");
var city = aa.env.getValue("city");
var timeZone = aa.env.getValue("timeZone");
var licenseKey = aa.env.getValue("licenseKey");
var cbTimeZoneDLSAdjust = aa.env.getValue("cbTimeZoneDLSAdjust");
var address1 = aa.env.getValue("address1");
var contactLine1 = aa.env.getValue("contactLine1");
var state = aa.env.getValue("state");
var aaReleaseVersion = aa.env.getValue("aaReleaseVersion");
var isPackageSolution = aa.env.getValue("isPackageSolution");
var spSeqNum = aa.env.getValue("spSeqNum");
var specialHandle = aa.env.getValue("specialHandle");
var useDepartmentName = aa.env.getValue("useDepartmentName");
var customizedApplicationNum = aa.env.getValue("customizedApplicationNum");
var DEF_NBR_RECEIPT_FLG = aa.env.getValue("DEF_NBR_RECEIPT_FLG");
var customizedInvoiceNum = aa.env.getValue("customizedInvoiceNum");
var appTypeDispOrder = aa.env.getValue("appTypeDispOrder");
var blockNonWorkDay = aa.env.getValue("blockNonWorkDay");
var specialAddressModel = aa.env.getValue("specialAddressModel");
var workflowAssignTaskDateFromDefaultValue = aa.env.getValue("workflowAssignTaskDateFromDefaultValue");
var accountDisableTimeframe = aa.env.getValue("accountDisableTimeframe");
var passwordTimeoutTimeframe = aa.env.getValue("passwordTimeoutTimeframe");
var passwordChange = aa.env.getValue("passwordChange");
var adhocMultipleAgencyReport = aa.env.getValue("adhocMultipleAgencyReport");
var findAppDateRange1 = aa.env.getValue("findAppDateRange1");
var multipleResult = aa.env.getValue("multipleResult");
var emseLogEnable = aa.env.getValue("emseLogEnable");
var payBPrint = aa.env.getValue("payBPrint");
var permitStyle = aa.env.getValue("permitStyle");
var issuePermitAfterFeePaid = aa.env.getValue("issuePermitAfterFeePaid");
var eMailHyperlinkFlag = aa.env.getValue("eMailHyperlinkFlag");
var recalulateInvoiceFee = aa.env.getValue("recalulateInvoiceFee");
var CommasNumericFlag = aa.env.getValue("CommasNumericFlag");
var feeAuditTrail = aa.env.getValue("feeAuditTrail");
var enableAppName = aa.env.getValue("enableAppName");
var ACC_CODE_L1 = aa.env.getValue("ACC_CODE_L1");
var ACC_CODE_L2 = aa.env.getValue("ACC_CODE_L2");
var ACC_CODE_L3 = aa.env.getValue("ACC_CODE_L3");
var enableAuditName = aa.env.getValue("enableAuditName");
var enableContactSnapshotName = aa.env.getValue("enableContactSnapshotName");
var enableAuditName4GuideSheet = aa.env.getValue("enableAuditName4GuideSheet");
var rbParticipateInDelegation = aa.env.getValue("rbParticipateInDelegation");
var DEF_NBR_INVOICE_FLG = aa.env.getValue("DEF_NBR_INVOICE_FLG");
var UOrgNaAlias = aa.env.getValue("UOrgNaAlias");
var sysdate = (db=='ORACLE'?'sysdate':'getdate');
var emailHyperLink = aa.env.getValue("EMAIL_HYPERLINK");
var updateFeeFlay = aa.env.getValue("updateFeeFlay");
var commasNumFormat = aa.env.getValue("commasNumFormat");
var emseLogEnable = aa.env.getValue("emseLogEnable");
var activeSolutionsName = aa.env.getValue("activeSolutionsName");
var selectedModules = aa.env.getValue("selectedModules");

createAgency();

/**
 * Main function, used to create agency and import license.
 */
function createAgency()
{
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var pst = null;
	var rSet = null;
	try
	{
		var reVal = getSequence('RSERV_PROV_SEQ');
		var sqlValue = new Array();
		
		sqlValue.push(address1,'',spSeqNum,city,contactLine1,'','','1',jurisdiction,agencyName,sysdate,'ADMIN','','','A',
				servProvCode,state,zip,1,10,0,'',customizedApplicationNum,reVal,aaReleaseVersion,timeZone,cbTimeZoneDLSAdjust,specialHandle,
				accountDisableTimeframe,passwordTimeoutTimeframe,passwordChange,isPackageSolution);
		var sql = "INSERT INTO RSERV_PROV(ADDRESS1,ADDRESS2,APO_SRC_SEQ_NBR,CITY,CONTACT_LINE1,CONTACT_LINE2,GRAPHIC_PATH,LAST_RECIEPT_NBR," +
				"NAME,NAME2,REC_DATE,REC_FUL_NAM,REC_LOCK,REC_SECURITY,REC_STATUS,SERV_PROV_CODE,STATE,ZIP, LAST_INVOICE_NBR, LAST_PROJECT_NBR," +
				"LAST_SET_ID,SET_ID_PREFIX,DEF_NBR_SCHEME_FLG,SERV_PROV_NBR,AARELEASE_VERSION,TIME_ZONE, DAYLIGHT_SAVING, SPECIAL_HANDLE," +
				"ACCOUNT_DISABLE_PERIOD, PASSWORD_EXPIRE_TIMEFRAME,ALLOW_USER_CHANGE_PASSWORD,IS_PACKAGED_SOLUTION) VALUES";
		sql = append(sql,sqlValue);
		sql = replaceDate(sql);
		pst = conn.prepareStatement(sql);
		rSet = pst.executeUpdate();
		importLicense(conn);
		copyPortlets(conn);
		addConstants(conn);
		addStandardChoice(conn);
		initFee(conn);
		initUser(conn);
		initUserProfile(conn);
		initSeqDef(conn);
		enableAllSolutions(conn);
	}finally{
		closeDBQueryObject(pst,conn);
	}
}

/**
 * Import License.
 * @param conn
 * @returns
 */
function importLicense(conn){
	var sql = "INSERT INTO XPOLICY (SERV_PROV_CODE, POLICY_NAME, LEVEL_TYPE, LEVEL_DATA, POLICY_SEQ,DATA1, DATA2, DATA3, DATA4, DATA5, MENUITEM_CODE," +
			"RIGHT_GRANTED, STATUS,REC_DATE,REC_FUL_NAM,REC_STATUS, MENU_LEVEL) VALUES";
	var licenseSeq = getSequence('XPOLICY_SEQ');
	var sqlVal = new Array();
	sqlVal.push(servProvCode,'LoginPolicy','Licensing','Licensing',licenseSeq,licenseKey[0],licenseKey[1],'','','','','F','E',sysdate,'Licensing','A','');
	sql = append(sql,sqlVal);
	sql = replaceDate(sql);
	sql = sql.replace(/'null'/,'null');
	pst = conn.prepareStatement(sql);
	pst.executeUpdate();
}

/**
 * Copy portlet configuration from Standard.
 * @param conn
 * @returns
 */
function copyPortlets(conn){
	var sql = "INSERT INTO GPORTLET ( PORTLET_ID, PORTLET_DES, PORTLET_URL, PORTAL_PAGE_ID, FID, REC_STATUS,REC_FUL_NAM, REC_DATE, PORTLET_ICON, SERV_PROV_CODE) " +
			"SELECT G.PORTLET_ID, G.PORTLET_DES, G.PORTLET_URL, G.PORTAL_PAGE_ID, G.FID, G.REC_STATUS,G.REC_FUL_NAM, G.REC_DATE, G.PORTLET_ICON, '" + servProvCode +
			"' FROM GPORTLET G WHERE SERV_PROV_CODE = 'STANDARDDATA'";
	pst = conn.prepareStatement(sql);
	pst.executeUpdate();
}

/**
 * Prepare constants SQL.
 * @param conn
 * @returns
 */
function addConstants(conn){
	var SQLs = new Array();
	var FEEAUDITTRAIL_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES";
	var sqlVal  = new Array();
	sqlVal.push(servProvCode,'FEEAUDITTRAIL',feeAuditTrail,'Fee Audit Trail Switch',sysdate,'ADMIN','A');
	FEEAUDITTRAIL_SQL = append(FEEAUDITTRAIL_SQL,sqlVal);
	FEEAUDITTRAIL_SQL = replaceDate(FEEAUDITTRAIL_SQL);
	SQLs.push(FEEAUDITTRAIL_SQL);
	
	var ACC_CODE_L1_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES"
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ACC_CODE_L1',ACC_CODE_L1,'Account Code 1 for Adjustment',sysdate,'ADMIN','A');
	ACC_CODE_L1_SQL = append(ACC_CODE_L1_SQL,sqlVal);
	ACC_CODE_L1_SQL = replaceDate(ACC_CODE_L1_SQL);
	SQLs.push(ACC_CODE_L1_SQL);
	
	var ACC_CODE_L2_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES"
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ACC_CODE_L2',ACC_CODE_L2,'Account Code 2 for Adjustment',sysdate,'ADMIN','A');
	ACC_CODE_L2_SQL = append(ACC_CODE_L2_SQL,sqlVal);
	ACC_CODE_L2_SQL = replaceDate(ACC_CODE_L2_SQL);
	SQLs.push(ACC_CODE_L2_SQL);
	
	var ACC_CODE_L3_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES"
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ACC_CODE_L3',ACC_CODE_L3,'Account Code 3 for Adjustment',sysdate,'ADMIN','A');
	ACC_CODE_L3_SQL = append(ACC_CODE_L3_SQL,sqlVal);
	ACC_CODE_L3_SQL = replaceDate(ACC_CODE_L3_SQL);
	SQLs.push(ACC_CODE_L3_SQL);
	
	var PRINTPERMITSTYLE_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'PRINTPERMITSTYLE',permitStyle,'PrintStyle',sysdate,'ADMIN','A');
	PRINTPERMITSTYLE_SQL = append(PRINTPERMITSTYLE_SQL,sqlVal);
	PRINTPERMITSTYLE_SQL = replaceDate(PRINTPERMITSTYLE_SQL);
	SQLs.push(PRINTPERMITSTYLE_SQL);
	
	var PAYBEFOREPRINT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status ) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'PAYBEFOREPRINT',payBPrint,'PayBeforePrint',sysdate,'ADMIN','A');
	PAYBEFOREPRINT_SQL = append(PAYBEFOREPRINT_SQL,sqlVal);
	PAYBEFOREPRINT_SQL = replaceDate(PAYBEFOREPRINT_SQL);
	SQLs.push(PAYBEFOREPRINT_SQL);
	
	var ENABLE_APP_NAME_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_APP_NAME',enableAppName,'ENABLE APPLICATION NAME',sysdate,'ADMIN','A','Y');
	ENABLE_APP_NAME_SQL = append(ENABLE_APP_NAME_SQL,sqlVal);
	ENABLE_APP_NAME_SQL = replaceDate(ENABLE_APP_NAME_SQL);
	SQLs.push(ENABLE_APP_NAME_SQL);
	
	var ENABLE_AUDIT_CAP_AND_ASI_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_CAP_AND_ASI','NO','ENABLE_AUDIT_CAP_AND_ASI',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_CAP_AND_ASI_SQL = append(ENABLE_AUDIT_CAP_AND_ASI_SQL,sqlVal);
	ENABLE_AUDIT_CAP_AND_ASI_SQL = replaceDate(ENABLE_AUDIT_CAP_AND_ASI_SQL);
	SQLs.push(ENABLE_AUDIT_CAP_AND_ASI_SQL);
	
	var ENABLE_CONTACT_SNAPSHOT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_CONTACT_SNAPSHOT','NO','ENABLE CONTACT SNAPSHOT',sysdate,'ADMIN','A','Y');
	ENABLE_CONTACT_SNAPSHOT_SQL = append(ENABLE_CONTACT_SNAPSHOT_SQL,sqlVal);
	ENABLE_CONTACT_SNAPSHOT_SQL = replaceDate(ENABLE_CONTACT_SNAPSHOT_SQL);
	SQLs.push(ENABLE_CONTACT_SNAPSHOT_SQL);
	
	var ENABLE_AUDIT_GUIDE_SHEET_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_GUIDE_SHEET','NO','ENABLE AUDIT GUIDE SHEET LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_GUIDE_SHEET_SQL = append(ENABLE_AUDIT_GUIDE_SHEET_SQL,sqlVal);
	ENABLE_AUDIT_GUIDE_SHEET_SQL = replaceDate(ENABLE_AUDIT_GUIDE_SHEET_SQL);
	SQLs.push(ENABLE_AUDIT_GUIDE_SHEET_SQL);
	
	var ENABLE_AUDIT_CONDITION_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_CONDITION','NO','ENABLE AUDIT RECORD CONDITION LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_CONDITION_SQL = append(ENABLE_AUDIT_CONDITION_SQL,sqlVal);
	ENABLE_AUDIT_CONDITION_SQL = replaceDate(ENABLE_AUDIT_CONDITION_SQL);
	SQLs.push(ENABLE_AUDIT_CONDITION_SQL);
	
	var ENABLE_AUDIT_REF_CONDITION_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_REF_CONDITION','NO','ENABLE AUDIT REF CONDITION LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_REF_CONDITION_SQL = append(ENABLE_AUDIT_REF_CONDITION_SQL,sqlVal);
	ENABLE_AUDIT_REF_CONDITION_SQL = replaceDate(ENABLE_AUDIT_REF_CONDITION_SQL);
	SQLs.push(ENABLE_AUDIT_REF_CONDITION_SQL);
	
	var ENABLE_AUDIT_STD_CONDITION_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_STD_CONDITION','NO','ENABLE AUDIT STD CONDITION LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_STD_CONDITION_SQL = append(ENABLE_AUDIT_STD_CONDITION_SQL,sqlVal);
	ENABLE_AUDIT_STD_CONDITION_SQL = replaceDate(ENABLE_AUDIT_STD_CONDITION_SQL);
	SQLs.push(ENABLE_AUDIT_STD_CONDITION_SQL);
	
	var ENABLE_AUDIT_DOCUMENT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_DOCUMENT','NO','ENABLE AUDIT DOCUMENT LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_DOCUMENT_SQL = append(ENABLE_AUDIT_DOCUMENT_SQL,sqlVal);
	ENABLE_AUDIT_DOCUMENT_SQL = replaceDate(ENABLE_AUDIT_DOCUMENT_SQL);
	SQLs.push(ENABLE_AUDIT_DOCUMENT_SQL);
	
	var ENABLE_AUDIT_EXAMINATION_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_EXAMINATION','NO','ENABLE AUDIT EXAMINATION LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_EXAMINATION_SQL = append(ENABLE_AUDIT_EXAMINATION_SQL,sqlVal);
	ENABLE_AUDIT_EXAMINATION_SQL = replaceDate(ENABLE_AUDIT_EXAMINATION_SQL);
	SQLs.push(ENABLE_AUDIT_EXAMINATION_SQL);
	
	var ENABLE_AUDIT_ASSET_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_AUDIT_ASSET','NO','ENABLE AUDIT ASSET LOG',sysdate,'ADMIN','A','Y');
	ENABLE_AUDIT_ASSET_SQL = append(ENABLE_AUDIT_ASSET_SQL,sqlVal);
	ENABLE_AUDIT_ASSET_SQL = replaceDate(ENABLE_AUDIT_ASSET_SQL);
	SQLs.push(ENABLE_AUDIT_ASSET_SQL);
	
	var ENABLE_WORKFLOW_SNAPSHOT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENABLE_WORKFLOW_SNAPSHOT','NO','ENABLE WORKFLOW SNAPSHOT',sysdate,'ADMIN','A','Y');
	ENABLE_WORKFLOW_SNAPSHOT_SQL = append(ENABLE_WORKFLOW_SNAPSHOT_SQL,sqlVal);
	ENABLE_WORKFLOW_SNAPSHOT_SQL = replaceDate(ENABLE_WORKFLOW_SNAPSHOT_SQL);
	SQLs.push(ENABLE_WORKFLOW_SNAPSHOT_SQL);
	
	var SPECIAL_ADDRESS_MODEL_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'SPECIAL ADDRESS MODEL','No','Search Address by Address Number and Unit Number',sysdate,'ADMIN','A');
	SPECIAL_ADDRESS_MODEL_SQL = append(SPECIAL_ADDRESS_MODEL_SQL,sqlVal);
	SPECIAL_ADDRESS_MODEL_SQL = replaceDate(SPECIAL_ADDRESS_MODEL_SQL);
	SQLs.push(SPECIAL_ADDRESS_MODEL_SQL);
	
	var CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CUSTOMIZED_APPTYPE_DISPLAYORDER','N','Customized Application Type Display Order',sysdate,'ADMIN','A');
	CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL = append(CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL,sqlVal);
	CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL = replaceDate(CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL);
	SQLs.push(CUSTOMIZED_APPTYPE_DISPLAYORDER_SQL);
	
	var ASSGNTASKS_DATE_FROM_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ASSGNTASKS_DATE_FROM','30','Controls the Default value for the Date From field in the Assign Tasks screen in Days. The Value in the Current Date.',sysdate,'ADMIN','A');
	ASSGNTASKS_DATE_FROM_SQL = append(ASSGNTASKS_DATE_FROM_SQL,sqlVal);
	ASSGNTASKS_DATE_FROM_SQL = replaceDate(ASSGNTASKS_DATE_FROM_SQL);
	SQLs.push(ASSGNTASKS_DATE_FROM_SQL);
	
	var BLOCK_NONWORKING_DAYS_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'BLOCK NONWORKING DAYS','Yes','Activate Next Working Day btn',sysdate,'ADMIN','A');
	BLOCK_NONWORKING_DAYS_SQL = append(BLOCK_NONWORKING_DAYS_SQL,sqlVal);
	BLOCK_NONWORKING_DAYS_SQL = replaceDate(BLOCK_NONWORKING_DAYS_SQL);
	SQLs.push(BLOCK_NONWORKING_DAYS_SQL);
	
	var INSPECTION_MULTIPLE_RESULT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'INSPECTION MULTIPLE RESULT','No','Inspection Results 4.0 Multiple Result Screen',sysdate,'ADMIN','A');
	INSPECTION_MULTIPLE_RESULT_SQL = append(INSPECTION_MULTIPLE_RESULT_SQL,sqlVal);
	INSPECTION_MULTIPLE_RESULT_SQL = replaceDate(INSPECTION_MULTIPLE_RESULT_SQL);
	SQLs.push(INSPECTION_MULTIPLE_RESULT_SQL);
	
	var CUSTOMIZED_RECEIPT_NUMBER_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CUSTOMIZED_RECEIPT_NUMBER',DEF_NBR_RECEIPT_FLG,'Customized Receipt Number',sysdate,'ADMIN','A');
	CUSTOMIZED_RECEIPT_NUMBER_SQL = append(CUSTOMIZED_RECEIPT_NUMBER_SQL,sqlVal);
	CUSTOMIZED_RECEIPT_NUMBER_SQL = replaceDate(CUSTOMIZED_RECEIPT_NUMBER_SQL);
	SQLs.push(CUSTOMIZED_RECEIPT_NUMBER_SQL);
	
	var PARTICIPATE_IN_DELEGATION_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'PARTICIPATE_IN_DELEGATION',rbParticipateInDelegation,'IS PARTICIPATE IN DELEGATION',sysdate,'ADMIN','A','Y');
	PARTICIPATE_IN_DELEGATION_SQL = append(PARTICIPATE_IN_DELEGATION_SQL,sqlVal);
	PARTICIPATE_IN_DELEGATION_SQL = replaceDate(PARTICIPATE_IN_DELEGATION_SQL);
	SQLs.push(PARTICIPATE_IN_DELEGATION_SQL);
	
	var CUSTOMIZED_INVOICE_NUMBER_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CUSTOMIZED_INVOICE_NUMBER',DEF_NBR_INVOICE_FLG,'Customized Invoice Number',sysdate,'ADMIN','A');
	CUSTOMIZED_INVOICE_NUMBER_SQL = append(CUSTOMIZED_INVOICE_NUMBER_SQL,sqlVal);
	CUSTOMIZED_INVOICE_NUMBER_SQL = replaceDate(CUSTOMIZED_INVOICE_NUMBER_SQL);
	SQLs.push(CUSTOMIZED_INVOICE_NUMBER_SQL);
	
	var ALIAS_USE_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status,VISIBLE) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ALIAS USE',UOrgNaAlias,'Check ALIAS USE Field',sysdate,'ADMIN','A','Y');
	ALIAS_USE_SQL = append(ALIAS_USE_SQL,sqlVal);
	ALIAS_USE_SQL = replaceDate(ALIAS_USE_SQL);
	SQLs.push(ALIAS_USE_SQL);
	
	var EMAIL_HYPERLINK_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'EMAIL_HYPERLINK',emailHyperLink,'The controller of Email hyperlink',sysdate,'ADMIN','A');
	EMAIL_HYPERLINK_SQL = append(EMAIL_HYPERLINK_SQL,sqlVal);
	EMAIL_HYPERLINK_SQL = replaceDate(EMAIL_HYPERLINK_SQL);
	SQLs.push(EMAIL_HYPERLINK_SQL);updateFeeFlay
	
	var UPDATE_FEE_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'UPDATEPAIDEDFEE',updateFeeFlay,'To control the right of recalculating for paied fee',sysdate,'ADMIN','A');
	UPDATE_FEE_SQL = append(UPDATE_FEE_SQL,sqlVal);
	UPDATE_FEE_SQL = replaceDate(UPDATE_FEE_SQL);
	SQLs.push(UPDATE_FEE_SQL);
	
	var COMMAS_NUMERIC_APP_TASK_FORMAT_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'COMMAS_NUMERIC_APP_TASK_FORMAT',commasNumFormat,'Commas in Numeric App and Task Specific Info Fields',sysdate,'ADMIN','A');
	COMMAS_NUMERIC_APP_TASK_FORMAT_SQL = append(COMMAS_NUMERIC_APP_TASK_FORMAT_SQL,sqlVal);
	COMMAS_NUMERIC_APP_TASK_FORMAT_SQL = replaceDate(COMMAS_NUMERIC_APP_TASK_FORMAT_SQL);
	SQLs.push(COMMAS_NUMERIC_APP_TASK_FORMAT_SQL);
	
	var EMSE_LOG_ENABLE_SQL = "INSERT INTO r1server_constant(serv_prov_code, constant_name, constant_value, description,rec_date,rec_ful_nam,rec_status) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'EMSE_LOG_ENABLE',commasNumFormat,'Enable EMSE Logging',sysdate,'ADMIN','A');
	EMSE_LOG_ENABLE_SQL = append(EMSE_LOG_ENABLE_SQL,sqlVal);
	EMSE_LOG_ENABLE_SQL = replaceDate(EMSE_LOG_ENABLE_SQL);
	SQLs.push(EMSE_LOG_ENABLE_SQL);
	
	//
	
	batchConstantsSQL(conn,SQLs);
}

/**
 * Can't use batch script here, iterator to insert constants.
 * @param conn
 * @param sqlArr
 * @returns
 */
function batchConstantsSQL(conn,sqlArr)
{
	pst = conn.createStatement();
	for(var i = 0;i < sqlArr.length;i++){
		pst.executeUpdate(sqlArr[i]);
	}
}

/**
 * Insert default Standard Choice.
 * @param conn
 * @returns
 */
function addStandardChoice(conn){
	var FIND_APP_RANGE_BIZ_SQL = 'INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES';
	var sqlVal = new Array();
	sqlVal.push(servProvCode,'Find App Date Range','Find App Date Range','30',sysdate,'ADMIN','A');
	FIND_APP_RANGE_BIZ_SQL = append(FIND_APP_RANGE_BIZ_SQL,sqlVal);
	FIND_APP_RANGE_BIZ_SQL = replaceDate(FIND_APP_RANGE_BIZ_SQL);
	
	var FIND_APP_RANGE_DOMAIN_SQL = 'INSERT INTO RBIZDOMAIN_VALUE(SERV_PROV_CODE,BIZDOMAIN,BIZDOMAIN_VALUE,BDV_SEQ_NBR,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES';
	sqlVal = new Array();
	var domainSeq = getSequence('RBIZDOMAIN_VALUE_SEQ');
	sqlVal.push(servProvCode,'Find App Date Range',findAppDateRange1,domainSeq,sysdate,'ADMIN','A');
	FIND_APP_RANGE_DOMAIN_SQL = append(FIND_APP_RANGE_DOMAIN_SQL,sqlVal);
	FIND_APP_RANGE_DOMAIN_SQL = replaceDate(FIND_APP_RANGE_DOMAIN_SQL);
	
	var HearBodyBizDomain_SQL = 'INSERT INTO RBIZDOMAIN (BIZDOMAIN, DEFAULT_VALUE, DESCRIPTION,REC_DATE, REC_FUL_NAM, REC_STATUS,SERV_PROV_CODE, VALUE_SIZE) VALUES';
	sqlVal = new Array();
	sqlVal.push('HEARING BODY','','Hearing Body',sysdate,'ADMIN','A',servProvCode,'40');
	HearBodyBizDomain_SQL = append(HearBodyBizDomain_SQL,sqlVal);
	HearBodyBizDomain_SQL = replaceDate(HearBodyBizDomain_SQL);
	
	var HearLocationBizDomain_SQL = 'INSERT INTO RBIZDOMAIN (BIZDOMAIN, DEFAULT_VALUE, DESCRIPTION,REC_DATE, REC_FUL_NAM, REC_STATUS,SERV_PROV_CODE, VALUE_SIZE) VALUES';
	sqlVal = new Array();
	sqlVal.push('HEARING LOCATION','','Hearing Location',sysdate,'ADMIN','A',servProvCode,'45');
	HearLocationBizDomain_SQL = append(HearLocationBizDomain_SQL,sqlVal);
	HearLocationBizDomain_SQL = replaceDate(HearLocationBizDomain_SQL);
	
	var UREAU_CONSTRUCTION_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,DEFAULT_VALUE,REC_DATE,REC_FUL_NAM,REC_STATUS)VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CENSUS_BUREAU_CONSTRUCTION_TYPE_CODE','Construction Code for Census Bureau','250','649',sysdate,'ADMIN','A');
	UREAU_CONSTRUCTION_SQL = append(UREAU_CONSTRUCTION_SQL,sqlVal);
	UREAU_CONSTRUCTION_SQL = replaceDate(UREAU_CONSTRUCTION_SQL);
	
	var CONDITION_STATUS_SQL = "INSERT INTO	RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CONDITION STATUS','Condition Status','30',sysdate,'ADMIN','A');
	CONDITION_STATUS_SQL = append(CONDITION_STATUS_SQL,sqlVal);
	CONDITION_STATUS_SQL = replaceDate(CONDITION_STATUS_SQL);
	
	var CONDITION_TYPE_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CONDITION TYPE','Condition Type','10',sysdate,'ADMIN','A');
	CONDITION_TYPE_SQL = append(CONDITION_TYPE_SQL,sqlVal);
	CONDITION_TYPE_SQL = replaceDate(CONDITION_TYPE_SQL);
	
	var REGIONAL_MODIFIER_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'REGIONAL MODIFIER','Regional Modifier for Valuation Calculator','10',sysdate,'ADMIN','A');
	REGIONAL_MODIFIER_SQL = append(REGIONAL_MODIFIER_SQL,sqlVal);
	REGIONAL_MODIFIER_SQL = replaceDate(REGIONAL_MODIFIER_SQL);
	
	var REGIONAL_MODIFIER_VALUE_SQL1 = "INSERT INTO	RBIZDOMAIN_VALUE(SERV_PROV_CODE,BIZDOMAIN,BIZDOMAIN_VALUE,BDV_SEQ_NBR,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	domainSeq = getSequence('RBIZDOMAIN_VALUE_SEQ');
	sqlVal.push(servProvCode,'REGIONAL MODIFIER','1.0',domainSeq,sysdate,'ADMIN','A');
	REGIONAL_MODIFIER_VALUE_SQL1 = append(REGIONAL_MODIFIER_VALUE_SQL1,sqlVal);
	REGIONAL_MODIFIER_VALUE_SQL1 = replaceDate(REGIONAL_MODIFIER_VALUE_SQL1);
	
	var CONTACT_RELATIONSHIP_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'CONTACT RELATIONSHIP','Contact Relationship','30',sysdate,'ADMIN','A');
	CONTACT_RELATIONSHIP_SQL = append(CONTACT_RELATIONSHIP_SQL,sqlVal);
	CONTACT_RELATIONSHIP_SQL = replaceDate(CONTACT_RELATIONSHIP_SQL);
	
	var COMPLAINT_REFERRED_TYPE_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'COMPLAINT REFERRED TYPE','Complaint Referred Type','30',sysdate,'ADMIN','A');
	COMPLAINT_REFERRED_TYPE_SQL = append(COMPLAINT_REFERRED_TYPE_SQL,sqlVal);
	COMPLAINT_REFERRED_TYPE_SQL = replaceDate(COMPLAINT_REFERRED_TYPE_SQL);
	
	var COMPLAINT_REFERRED_SOURCE_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'COMPLAINT REFERRED SOURCE','Complaint Referred Source','30',sysdate,'ADMIN','A');
	COMPLAINT_REFERRED_SOURCE_SQL = append(COMPLAINT_REFERRED_SOURCE_SQL,sqlVal);
	COMPLAINT_REFERRED_SOURCE_SQL = replaceDate(COMPLAINT_REFERRED_SOURCE_SQL);
	
	var EYE_COLOR_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENFORCEMENT DEFENDANT EYE COLOR','Enforcement Defendant Eye color','30',sysdate,'ADMIN','A');
	EYE_COLOR_SQL = append(EYE_COLOR_SQL,sqlVal);
	EYE_COLOR_SQL = replaceDate(EYE_COLOR_SQL);
	
	var HAIR_COLOR_SQL = "INSERT INTO RBIZDOMAIN(SERV_PROV_CODE,BIZDOMAIN,DESCRIPTION,VALUE_SIZE,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ENFORCEMENT DEFENDANT HAIR COLOR','Enforcement Defendant Hair color','30',sysdate,'ADMIN','A');
	HAIR_COLOR_SQL = append(HAIR_COLOR_SQL,sqlVal);
	HAIR_COLOR_SQL = replaceDate(HAIR_COLOR_SQL);
		
	pst = conn.createStatement();
	pst.executeUpdate(FIND_APP_RANGE_BIZ_SQL);
	
	//pst = conn.createStatement();
	pst.executeUpdate(FIND_APP_RANGE_DOMAIN_SQL);
	pst.executeUpdate(HearBodyBizDomain_SQL);
	pst.executeUpdate(HearLocationBizDomain_SQL);
	pst.executeUpdate(UREAU_CONSTRUCTION_SQL);
	pst.executeUpdate(CONDITION_STATUS_SQL);
	pst.executeUpdate(CONDITION_TYPE_SQL);
	pst.executeUpdate(REGIONAL_MODIFIER_SQL);
	pst.executeUpdate(REGIONAL_MODIFIER_VALUE_SQL1);
	pst.executeUpdate(CONTACT_RELATIONSHIP_SQL);
	pst.executeUpdate(COMPLAINT_REFERRED_TYPE_SQL);
	pst.executeUpdate(COMPLAINT_REFERRED_SOURCE_SQL);
	pst.executeUpdate(EYE_COLOR_SQL);
	pst.executeUpdate(HAIR_COLOR_SQL);
}

function initFee(conn){
	var Rpayment_Period_Adjustment_SQL = "INSERT INTO RPAYMENT_PERIOD(SERV_PROV_CODE,GF_FEE_PERIOD,DISPLAY_ORDER,REC_STATUS,REC_DATE,REC_FUL_NAM) VALUES";
	var sqlVal = new Array();
	sqlVal.push(servProvCode,'ADJUSTMENT','0','A',sysdate,'ADMIN');
	Rpayment_Period_Adjustment_SQL = append(Rpayment_Period_Adjustment_SQL,sqlVal);
	Rpayment_Period_Adjustment_SQL = replaceDate(Rpayment_Period_Adjustment_SQL);
	pst = conn.createStatement();
	pst.executeUpdate(Rpayment_Period_Adjustment_SQL);
}

function initUser(conn){
	var ADMIN_USER_SQL = "INSERT INTO PUSER (SERV_PROV_CODE, USER_NAME, PASSWORD,DISP_NAME, STATUS, REC_DATE, REC_FUL_NAM, REC_STATUS, GA_USER_ID) VALUES";
	var sqlVal = new Array();
	sqlVal.push(servProvCode,'ADMIN','d033e22ae348aeb5660fc2140aec35850c4da997','ADMIN','ENABLE',sysdate,'ADMIN','A','ADMIN');
	ADMIN_USER_SQL = append(ADMIN_USER_SQL,sqlVal);
	ADMIN_USER_SQL = replaceDate(ADMIN_USER_SQL);
	
	var G3STAFFS_SQL = "INSERT INTO G3STAFFS(SERV_PROV_CODE, GA_USER_ID, GA_AGENCY_CODE,GA_BUREAU_CODE, GA_DIVISION_CODE, GA_GROUP_CODE, GA_OFFICE_CODE, GA_SECTION_CODE," +
			"USER_NAME, REC_DATE, REC_FUL_NAM, REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'ADMIN','NA','NA','NA','NA','NA','NA','ADMIN',sysdate,'ADMIN','A');
	G3STAFFS_SQL = append(G3STAFFS_SQL,sqlVal);
	G3STAFFS_SQL = replaceDate(G3STAFFS_SQL);
	
	pst = conn.createStatement();
	pst.executeUpdate(ADMIN_USER_SQL);
	pst.executeUpdate(G3STAFFS_SQL);
}

function initUserProfile(conn){
	var FIND_GENERAL_SQL = "SELECT * FROM RUSER_PROFILE WHERE PROFILE_GROUP_ID = 'GENERAL'";
	var sqlCollection = new Array();
	pst = conn.createStatement();
	rSet = pst.executeQuery(FIND_GENERAL_SQL);
	while(rSet.next()){
		var INSERT_SQL = "INSERT INTO PUSER_PROFILE (serv_prov_code,user_name,profile_seq_nbr,profile_value,rec_date,rec_ful_nam,rec_status) VALUES";
		var sqlVal = new Array();
		sqlVal.push(servProvCode,'ADMIN',rSet.getString("PROFILE_SEQ_NBR"),rSet.getString("PROFILE_DEFAULT"),sysdate,'ADMIN','A');
		INSERT_SQL = append(INSERT_SQL,sqlVal);
		INSERT_SQL = replaceDate(INSERT_SQL);
		sqlCollection.push(INSERT_SQL);
	}
	pst = conn.createStatement();
	for(var i =0; i < sqlCollection.length;i++){
		pst.executeUpdate(sqlCollection[i]);
	}
	
	var GET_DEFAULT_MODULE = "SELECT profile_seq_nbr FROM RUSER_PROFILE WHERE profile_group_id = 'GENERAL' AND profile_name = 'Default Module'";
	pst = conn.createStatement();
	rSet = pst.executeQuery(GET_DEFAULT_MODULE);
	var uprofileCollection =  new Array();
	while(rSet.next()){
		var profileSeqNBR = rSet.getString("profile_seq_nbr");
		var UPDATE_PROFILE_SQL = "UPDATE PUSER_PROFILE SET PUSER_PROFILE.PROFILE_VALUE ='Building',PUSER_PROFILE.REC_DATE = '"+sysdate+"'," +
				"PUSER_PROFILE.REC_FUL_NAM = 'ADMIN' WHERE PUSER_PROFILE.PROFILE_SEQ_NBR = " + profileSeqNBR + " AND PUSER_PROFILE.USER_NAME = 'ADMIN' " +
				"AND PUSER_PROFILE.SERV_PROV_CODE ="+"'"+servProvCode+"'";
		UPDATE_PROFILE_SQL = replaceDate(UPDATE_PROFILE_SQL);
		uprofileCollection.push(UPDATE_PROFILE_SQL);
	}
	pst = conn.createStatement();
	for(var i=0; i < uprofileCollection.length;i++)
	{
		pst.executeUpdate(uprofileCollection[i]);
	}
}

function initSeqDef(conn){
	var PARTICAL_CAP_DEF = "INSERT INTO AA_SEQ_DEF (SERV_PROV_CODE,SEQ_TYPE,SEQ_NAME,SEQ_DESCRIPTION,SEQ_CACHE_SIZE,SEQ_INCR_BY,SEQ_MIN,SEQ_RESET,SEQ_RESET_ACTION," +
	"SEQ_INTERVAL_TYPE,REC_DATE,REC_FUL_NAM,REC_STATUS ) VALUES";
	var sqlVal = new Array();
	sqlVal.push(servProvCode,'Partial CAP ID','Default','Default sequence Definition for Partial CAP ID','1','1','1','999999','E','CY',sysdate,'ADMIN','A');
	PARTICAL_CAP_DEF = append(PARTICAL_CAP_DEF,sqlVal);
	PARTICAL_CAP_DEF = replaceDate(PARTICAL_CAP_DEF);
	
	var PARTICAL_CAP_MASK = "INSERT INTO AA_MASK_DEF (SERV_PROV_CODE,SEQ_TYPE,MASK_NAME,MASK_DESCRIPTION,MASK_PATTERN,MASK_MAX_LENGTH,MASK_MIN_LENGTH,SEQ_NAME," +
			"SEQ_RADIX,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'Partial CAP ID','Default','Mask Definition for Partial CAP ID','$$yy$$EST-$$SEQ06$$','30','1','Default','10',sysdate,'ADMIN','A');
	PARTICAL_CAP_MASK = append(PARTICAL_CAP_MASK,sqlVal);
	PARTICAL_CAP_MASK = replaceDate(PARTICAL_CAP_MASK);
	
	var TEMP_CAP_DEF = "INSERT INTO AA_SEQ_DEF (SERV_PROV_CODE,SEQ_TYPE,SEQ_NAME,SEQ_DESCRIPTION,SEQ_CACHE_SIZE,SEQ_INCR_BY,SEQ_MIN,SEQ_RESET,SEQ_RESET_ACTION," +
	"SEQ_INTERVAL_TYPE,REC_DATE,REC_FUL_NAM,REC_STATUS ) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'Temporary CAP ID','Default','Default sequence Definition for Temporary CAP ID','1','1','1','999999','E','CY',sysdate,'ADMIN','A');
	TEMP_CAP_DEF = append(TEMP_CAP_DEF,sqlVal);
	TEMP_CAP_DEF = replaceDate(TEMP_CAP_DEF);
	
	var TEMP_CAP_MASK = "INSERT INTO AA_MASK_DEF (SERV_PROV_CODE,SEQ_TYPE,MASK_NAME,MASK_DESCRIPTION,MASK_PATTERN,MASK_MAX_LENGTH,MASK_MIN_LENGTH,SEQ_NAME," +
		"SEQ_RADIX,REC_DATE,REC_FUL_NAM,REC_STATUS) VALUES";
	sqlVal = new Array();
	sqlVal.push(servProvCode,'Temporary CAP ID','Default','Mask Definition for Temporary CAP ID','$$yy$$TMP-$$SEQ06$$','30','1','Default','10',sysdate,'ADMIN','A');
	TEMP_CAP_MASK = append(TEMP_CAP_MASK,sqlVal);
	TEMP_CAP_MASK = replaceDate(TEMP_CAP_MASK);

	pst = conn.createStatement();
	pst.executeUpdate(PARTICAL_CAP_DEF);
	pst.executeUpdate(PARTICAL_CAP_MASK);
	pst.executeUpdate(TEMP_CAP_DEF);
	pst.executeUpdate(TEMP_CAP_MASK);
	
}

function enableAllSolutions(conn){
	//var solutions = activeSolutionsName.split(",");
	var enableModules = selectedModules.split(",");
	var AA_VERSION_NBR_SQL = "SELECT AA_VERSION_NBR FROM RSERV_PROV A, AAVERSION B WHERE A.SERV_PROV_CODE ='"+servProvCode+"'" +" AND A.AARELEASE_VERSION=B.AA_VERSION";
	var aaVersionNBR = "";
	pst = conn.createStatement();
	rSet = pst.executeQuery(AA_VERSION_NBR_SQL);
	while(rSet.next()){
		aaVersionNBR = rSet.getString("AA_VERSION_NBR");
		break;
	}
	if(aaVersionNBR==""){
		aa.env.setValue("ScriptReturnCode","-1");
	}
//	var ALL_MODULES_SQL = "SELECT A.SOLUTION_NAME, A.MODULE_NAME,B.CONSTANT_VALUE from (SELECT SOLUTION_NAME, MODULE_NAME FROM AAVERSION_MODULE" +
//			" WHERE AA_VERSION_NBR='"+aaVersionNBR+"'" + " AND REC_STATUS = 'A') A left outer join R1SERVER_CONSTANT B on UPPER(A.MODULE_NAME) = UPPER(B.CONSTANT_NAME)" +
//			" AND B.DESCRIPTION = 'Module' AND B.SERV_PROV_CODE ='"+servProvCode+"' order by A.SOLUTION_NAME, A.MODULE_NAME";
//	rSet = pst.executeQuery(ALL_MODULES_SQL);
//	var solutionsMap = aa.util.newHashMap();
//	while(rSet.next()){
//		var solutionName = rSet.getString("SOLUTION_NAME");
//		var moduleName = rSet.getString("MODULE_NAME");
//		if(null == solutionsMap.get(solutionName)){
//			var modules = aa.util.newArrayList();
//			modules.add(moduleName);
//			solutionsMap.put(solutionName,modules);
//		}else{
//			solutionsMap.get(solutionName).add(moduleName);
//		}
//	}
	var constantsSQL =  new Array();
	var menuModuleSQL =  new Array();
	var menuModuleSQL1 = new Array();
	var menuModuleSQL2 = new Array();
	var menuModuleSQL3 = new Array();
	var menuModuleSQL4 = new Array();
	var ppGroupSQL = new Array();
	var puGroupSQL = new Array();
	var xGroupMenuSQL = new Array();
	var xGroupMenuSQL1 = new Array();
	var xGroupMenuSQL2 = new Array();
	if (null != enableModules && enableModules.length > 0) {
		for (var j = 0; j < enableModules.length; j++) {
			var module = enableModules[j];
			var constants_sql = "INSERT INTO r1server_constant(serv_prov_code,constant_name,constant_value,description,rec_date,rec_ful_nam,rec_status) VALUES";
			var sqlVal = new Array();
			sqlVal.push(servProvCode, module, 'Yes', 'Module', sysdate,
					'ADMIN', 'A');
			constants_sql = append(constants_sql, sqlVal);
			constants_sql = replaceDate(constants_sql);
			constantsSQL.push(constants_sql);

			var menu_module_sql = "INSERT INTO PPROV_MENUITEM_MODULE(serv_prov_code,module_name, menuitem_code,status, read_stat,"
					+ " edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status, DISP_STAT) SELECT '"
					+ servProvCode
					+ "','"
					+ module
					+ "',AM.menuitem_code,"
					+ "'ENABLE', 'Y', 'Y', 'Y', 'Y','"
					+ sysdate
					+ "','ADMIN', 'A', 'N' FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE"
					+ " AND A.MODULE_ALIAS = AM.MODULE_NAME AND V.REC_STATUS = 'A' AND A.REC_STATUS = 'A' AND	AM.REC_STATUS = 'A' AND	R.REC_STATUS = 'A'"
					+ " AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND (UPPER(AM.FUNCTION_OPTION)= 'BASIC' OR UPPER(AM.FUNCTION_OPTION)= 'F') AND AM.menuitem_code not in (SELECT"
					+ " AM.menuitem_code FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM, PPROV_MENUITEM_MODULE P WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR"
					+ " AND V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND V.REC_STATUS = 'A' AND A.REC_STATUS = 'A'"
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND (UPPER(AM.FUNCTION_OPTION)= 'BASIC' OR UPPER(AM.FUNCTION_OPTION)= 'F')"
					+ " AND AM.menuitem_code = P.menuitem_code AND P.serv_prov_code = '"
					+ servProvCode + "' AND P.module_name = '" + module + "')";
			menu_module_sql = replaceDate(menu_module_sql);
			menuModuleSQL.push(menu_module_sql);

			var menu_module_sql_1 = "INSERT INTO PPROV_MENUITEM_MODULE(serv_prov_code,module_name, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status, DISP_STAT)"
					+ " SELECT '"
					+ servProvCode
					+ "','"
					+ module
					+ "',AM.menuitem_code,'ENABLE', 'Y', 'N', 'N', 'N','"
					+ sysdate
					+ "', 'ADMIN','A', 'N' FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND	V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A'"
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND 	A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND UPPER(AM.FUNCTION_OPTION)= 'R' AND AM.menuitem_code not in(SELECT AM.menuitem_code FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM,PPROV_MENUITEM_MODULE P"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND	V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A' "
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND  AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND UPPER(AM.FUNCTION_OPTION)= 'R' AND AM.menuitem_code = P.menuitem_code AND P.serv_prov_code = '"
					+ servProvCode + "' AND P.module_name = '" + module + "')";
			menu_module_sql_1 = replaceDate(menu_module_sql_1);
			menuModuleSQL1.push(menu_module_sql_1);

			var menu_module_sql_2 = "INSERT INTO PPROV_MENUITEM_MODULE(serv_prov_code,module_name, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status, DISP_STAT)"
					+ " SELECT '"
					+ servProvCode
					+ "','"
					+ module
					+ "',AM.menuitem_code,'ENABLE', 'N', 'N', 'N', 'N','"
					+ sysdate
					+ "', 'ADMIN','A', 'N' FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND	V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A'"
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND 	A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module
					+ "' AND (UPPER(AM.FUNCTION_OPTION)= 'OPTIONAL' OR UPPER(AM.FUNCTION_OPTION) = 'N') AND AM.menuitem_code not in(SELECT AM.menuitem_code FROM 	RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM,PPROV_MENUITEM_MODULE P"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND	V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A' "
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND  AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module
					+ "' AND (UPPER(AM.FUNCTION_OPTION)= 'OPTIONAL' OR UPPER(AM.FUNCTION_OPTION)= 'N') AND AM.menuitem_code = P.menuitem_code AND P.serv_prov_code = '"
					+ servProvCode + "' AND P.module_name = '" + module + "')";
			menu_module_sql_2 = replaceDate(menu_module_sql_2);
			menuModuleSQL2.push(menu_module_sql_2);

			var menu_module_sql_3 = "INSERT INTO PPROV_MENUITEM_MODULE(serv_prov_code,module_name, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status, DISP_STAT)"
					+ " SELECT '"
					+ servProvCode
					+ "','"
					+ module
					+ "',R.menuitem_code,'ENABLE', 'N', 'N', 'N', 'N','"
					+ sysdate
					+ "', 'ADMIN','A', 'N' FROM RMENUITEM R,AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM"
					+ " WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND	V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND	V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A'"
					+ " AND AM.REC_STATUS = 'A' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND 	A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "'"
					+ " AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND	(UPPER(AM.FUNCTION_OPTION)= 'OPTIONAL' OR UPPER(AM.FUNCTION_OPTION)= 'N') AND AM.menuitem_code not in(SELECT AM.menuitem_code"
					+ " FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM,PPROV_MENUITEM_MODULE P WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR AND V.AA_VERSION_NBR = AM.AA_VERSION_NBR"
					+ " AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A' AND	AM.REC_STATUS = 'A' AND	R.REC_STATUS = 'A' AND	R.STATUS = 'ENABLE'"
					+ " AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "'"
					+ " AND (UPPER(AM.FUNCTION_OPTION)= 'OPTIONAL' OR UPPER(AM.FUNCTION_OPTION)= 'N') AND AM.menuitem_code = P.menuitem_code AND P.serv_prov_code = '"
					+ servProvCode + "' AND P.module_name = '" + module + "')";
			menu_module_sql_3 = replaceDate(menu_module_sql_3);
			menuModuleSQL3.push(menu_module_sql_3);

			var menu_module_sql_4 = "INSERT INTO PPROV_MENUITEM_MODULE( serv_prov_code,module_name, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status, DISP_STAT)"
					+ "SELECT '"
					+ servProvCode
					+ "', '"
					+ module
					+ "',R.menuitem_code,'ENABLE','N', 'N', 'N', 'N','"
					+ sysdate
					+ "','ADMIN','A', 'N' FROM RMENUITEM R WHERE R.MENUITEM_CODE LIKE '6%' AND R.REC_STATUS = 'A'"
					+ " AND R.STATUS = 'ENABLE' AND UPPER(TRIM(R.FUNCTION_CATEGORY)) in ('TESTING','STANDARD','"
					+ servProvCode
					+ "') AND R.MENUITEM_CODE NOT IN (SELECT  MENUITEM_CODE FROM PPROV_MENUITEM_MODULE p "
					+ "WHERE  p.serv_prov_code='"
					+ servProvCode
					+ "' AND upper(p.module_name)= '"
					+ module.toUpperCase()
					+ "' AND p.menuitem_code like '6%')";
			menu_module_sql_4 = replaceDate(menu_module_sql_4);
			menuModuleSQL4.push(menu_module_sql_4);

			var groupSeq = getSequence("PPROV_GROUP_SEQ");
			var USER_GROUP_SQL = "INSERT INTO pprov_group(group_seq_nbr,serv_prov_code,module_name,disp_text,status,rec_date,rec_ful_nam,rec_status)"
					+ " VALUES ("
					+ groupSeq
					+ ",'"
					+ servProvCode
					+ "','"
					+ module
					+ "','"
					+ module
					+ "Admin', 'ENABLE','"
					+ sysdate
					+ "','ADMIN', 'A')";
			USER_GROUP_SQL = replaceDate(USER_GROUP_SQL);
			ppGroupSQL.push(USER_GROUP_SQL);

			USER_GROUP_SQL_1 = "INSERT INTO PUSER_GROUP(serv_prov_code,user_name,group_seq_nbr,module_name,rec_date,rec_ful_nam,rec_status)"
					+ " VALUES ('"
					+ servProvCode
					+ "','ADMIN',"
					+ groupSeq
					+ ",'" + module + "','" + sysdate + "','ADMIN', 'A')";
			USER_GROUP_SQL_1 = replaceDate(USER_GROUP_SQL_1);
			puGroupSQL.push(USER_GROUP_SQL_1);

			var XGROUP_MENUITEM_MODULE_SQL_1 = "INSERT INTO XGROUP_MENUITEM_MODULE(serv_prov_code, group_seq_nbr, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status) SELECT"
					+ " '"
					+ servProvCode
					+ "','"
					+ groupSeq
					+ "',AM.menuitem_code,'ENABLE', 'Y', 'Y', 'Y', 'Y','"
					+ sysdate
					+ "','ADMIN', 'A' FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM "
					+ " WHERE V.AA_VERSION_NBR ='"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = V.AA_VERSION_NBR AND AM.AA_VERSION_NBR = A.AA_VERSION_NBR AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND AM.MODULE_NAME = A.MODULE_ALIAS"
					+ " AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND V.REC_STATUS = 'A' AND	A.REC_STATUS = 'A' AND AM.REC_STATUS = 'A' AND	R.REC_STATUS = 'A' AND	R.STATUS = 'ENABLE' AND	(UPPER(AM.FUNCTION_OPTION)= 'BASIC' OR UPPER(AM.FUNCTION_OPTION)= 'F')";
			XGROUP_MENUITEM_MODULE_SQL_1 = replaceDate(XGROUP_MENUITEM_MODULE_SQL_1);
			xGroupMenuSQL.push(XGROUP_MENUITEM_MODULE_SQL_1);

			var XGROUP_MENUITEM_MODULE_SQL_2 = "INSERT INTO XGROUP_MENUITEM_MODULE(serv_prov_code, group_seq_nbr, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status) SELECT '"
					+ servProvCode
					+ "',"
					+ "'"
					+ groupSeq
					+ "',AM.menuitem_code,'ENABLE', 'Y', 'N', 'N', 'N','"
					+ sysdate
					+ "','ADMIN','A' FROM RMENUITEM R, AAVERSION V, AAVERSION_MODULE A, AAVERSION_MENUITEM AM WHERE V.AA_VERSION_NBR = A.AA_VERSION_NBR"
					+ " AND V.AA_VERSION_NBR = AM.AA_VERSION_NBR AND AM.MENUITEM_CODE = R.MENUITEM_CODE AND A.MODULE_ALIAS = AM.MODULE_NAME AND V.REC_STATUS = 'A' AND A.REC_STATUS = 'A' AND	AM.REC_STATUS = 'A' AND	R.REC_STATUS = 'A'"
					+ " AND R.STATUS = 'ENABLE' AND V.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND A.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND AM.AA_VERSION_NBR = '"
					+ aaVersionNBR
					+ "' AND UPPER(A.MODULE_NAME) = '"
					+ module.toUpperCase()
					+ "' AND UPPER(AM.FUNCTION_OPTION)= 'R'";
			XGROUP_MENUITEM_MODULE_SQL_2 = replaceDate(XGROUP_MENUITEM_MODULE_SQL_2);
			xGroupMenuSQL1.push(XGROUP_MENUITEM_MODULE_SQL_2);

			var XGROUP_MENUITEM_MODULE_SQL_3 = "INSERT INTO XGROUP_MENUITEM_MODULE( serv_prov_code, group_seq_nbr, menuitem_code,status, read_stat, edit_stat, add_stat, del_stat, rec_date,rec_ful_nam, rec_status) SELECT '"
					+ servProvCode
					+ "',"
					+ "'"
					+ groupSeq
					+ "',R.menuitem_code,'ENABLE', 'N', 'N', 'N', 'N','"
					+ sysdate
					+ "','ADMIN','A' FROM RMENUITEM R WHERE  R.MENUITEM_CODE LIKE '6%' AND R.REC_STATUS = 'A' AND R.STATUS = 'ENABLE'"
					+ " AND UPPER(TRIM(R.FUNCTION_CATEGORY)) in ('TESTING','STANDARD','"
					+ servProvCode
					+ "') AND R.MENUITEM_CODE NOT IN (SELECT  MENUITEM_CODE FROM XGROUP_MENUITEM_MODULE x WHERE x.serv_prov_code='"
					+ servProvCode
					+ "'"
					+ " AND x.group_seq_nbr= '"
					+ groupSeq
					+ "' AND x.menuitem_code like '6%')";
			XGROUP_MENUITEM_MODULE_SQL_3 = replaceDate(XGROUP_MENUITEM_MODULE_SQL_3);
			xGroupMenuSQL2.push(XGROUP_MENUITEM_MODULE_SQL_3);
		}
	}
	executeBatch(constantsSQL, conn);
	executeBatch(menuModuleSQL, conn);
	executeBatch(menuModuleSQL1, conn);
	executeBatch(menuModuleSQL2, conn);
	executeBatch(menuModuleSQL3, conn);
	executeBatch(menuModuleSQL4, conn);
	executeBatch(ppGroupSQL, conn);
	executeBatch(puGroupSQL, conn);
	executeBatch(xGroupMenuSQL, conn);
	executeBatch(xGroupMenuSQL1, conn);
	executeBatch(xGroupMenuSQL2, conn);
}

function executeBatch(sqlArray,conn){
	if(sqlArray.length > 0){
		pst = conn.createStatement();
		for(var j = 0 ; j < sqlArray.length; j++){
			pst.addBatch(sqlArray[j]);
		}
		pst.executeBatch();
	}
}

function replaceDate(sql)
{
	if(db=='ORACLE'){
		sql = sql.replace(/'sysdate'/,'sysdate');
	}else{
		sql = sql.replace(/'getdate'/,'getDate()');
	}
	return sql;
}

/**
 * Prepare SQL
 * @param sql
 * @param array
 * @returns {String}
 */
function append(sql,array)
{
	if(array.length)
	{
		sql += " (";
		for(var i = 0; i < array.length;i++)
		{
			sql = sql + "'" + array[i] + "',";
		}
		sql = sql.substring(0,sql.length-1);
		sql += " )";
	}
	return sql;
}

/**
 * Get Sequence.
 * @param sequenceName
 * @returns
 */
function getSequence(sequenceName) {
	var client = aa.proxyInvoker.newInstance("com.accela.sequence.client.SequenceGeneratorClient");
	var result = client.getOutput().getSequenceGeneratorClient();
	var sequence = result.getOutput().getNextValue(sequenceName).getOutput();
	return sequence;
}

function safelyClose(rSet,pst)
{
	try{
		if(rSet){
			rSet.close();
			rSet = null;
		}
	}catch(err){
		aa.print("Failed to close the database result set object." + err);
	}
	try{
		if(pst){
			pst.close();
			pst = null;
		}
	}catch(err){
		aa.print("Failed to close the data base prepare statement object."+err);
	}
}
function closeDBQueryObject(sStmt, conn) {
	try {
			if(sStmt){
				sStmt.close();
				sStmt = null;
				aa.print("Statement is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database prepare statement object." + vError);
	}
	
	try {
			if (conn) {
				conn.close();
				conn = null;
				aa.print("Connection is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database connection." + vError);
	}
}