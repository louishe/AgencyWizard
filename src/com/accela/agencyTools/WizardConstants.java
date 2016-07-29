package com.accela.agencyTools;
import java.io.File;

import com.accela.security.Constants;
import com.accela.util.AVProperties;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: Constants.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: Constants.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 12, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class WizardConstants implements Constants
{
	public static final String DB = AVProperties.getProperty("av.db");
	
	public static final String DOMAIN = "AC360Agency";
	
	public static final String LOGIN_ADMIN = "ADMIN";
	
	public static final String LOGIN_AGENCY = "ADMIN";
	
	public static final String PRODUCT_LICENSE = "PRODUCT_LICENSE";
	
	public static final String LICENSE_SOLUTIONS = "SOLUTIONS";
	
	public static final String LICENSE_USED = "LICENSE_USED";
	
	public static final String WRONG_LICENSE = "WRONG_LICENSE";
	
	public static final String CORRECT_LICENSE = "SUCCESS";
	
	public static final String INVALID_FILE = "Invalid file.";
	
	public static final String CREATE_AGENCY_SCRIPT = "com/accela/agencyTools/rest/agencyWizard/script/createAgency.js";
	
	public static final String DELETE_AGENCY_SCRIPT = "com/accela/agencyTools/rest/agencyWizard/script/deleteAgency.js";
	
	public static final String GET_MODULE_NAMES = "com/accela/agencyTools/rest/agencyWizard/script/getModuleName.js";
	
	public static final String GET_USERCOUNT_4MODULE = "com/accela/agencyTools/rest/agencyWizard/script/getUserCountForModule.js";
	
	public static final String GET_MODULE_BY_SOLUTION = "com/accela/agencyTools/rest/agencyWizard/script/getModuleNameBySolution.js";
	
	public static final String WIZARD_CONFIG = "config/wizardConfig.properties";
	
	public static final String FLAG_Y = "Y";
	
	public static final String ACTIVE_SOLUTIONS_NAME = "ACTIVE_SOLUTIONS_NAME";
	
	public static final String REF_STANDARDBASE_URL = "https://api.github.com/repos/Accela-Inc/DataManagerExports/contents/StandardBase?ref=master";
	
	public static final String EXCULEDED_FILE = "README.md";
	
	public static final String SEPARATOR = "_";
	
	public static final String DATA_IMPORT = "Data Manager Import";
	
	public static final String JOB_STATUS = "On Hold";
	
	public static final String SYS = "System";
	
	public static final String PREFIX_IMPORT_FILE_NAME = AVProperties.getAAHome() + File.separator + "tmp" + File.separator + "agencyWizard";
	
	public static final String STANDARD_BASE_IMPORT_FILE = PREFIX_IMPORT_FILE_NAME + File.separator + "StandardBaseImport.zip";
	
	public static final String FILE_FETCHING = "Fetching";
	
	public static final String FILE_DONE = "Finished";
	
	public static final String STANDARD_BASE_TASK_NAME = "wizardStandardBaseTask";
	
	public static final String SSO_COOKIE = "acauth";
	
	public static final String DATA_IMPORT_POLICY_REJECT = "NO";
	
	public static final String DATA_MANAGER_ENDPOINT = AVProperties.getProperty("av.web.url") + "/av-proxy/av-biz-ws/services/admin/datamanager";

}

/*
*$Log: av-env.bat,v $
*/