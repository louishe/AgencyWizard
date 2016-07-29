package com.accela.agencyTools.rest.agencyWizard.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.ObjectInputStream;
import java.util.Date;

import javax.ws.rs.Path;

import org.springframework.stereotype.Component;

import com.accela.aa.datamanager.DataManagerConfigModel;
import com.accela.aa.datamanager.DataManagerModel;
import com.accela.aa.datamanager.DataManagerTaskService;
import com.accela.aa.util.EJBProxy;
import com.accela.aa.util.ValidationUtil;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.exceptions.GithubAccessException;
import com.accela.agencyTools.rest.agencyWizard.task.FileProgressHolder;
import com.accela.agencyTools.rest.agencyWizard.task.FileSignal;
import com.accela.agencyTools.util.GitFileHandler;
import com.accela.agencyTools.util.WizardHelper;
import com.accela.orm.model.batchjob.BatchJobModel;
import com.accela.orm.model.common.AuditModel;
import com.accela.v360.batchjob.BatchJobConstants;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: DataManagerService.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: DataManagerService.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 13, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class DataManagerService
{
	/**
	 * 
	 * Create Data Manager task.
	 *
	 * @param agencyCode
	 * @param jobName
	 * @param targetModule
	 * @param taskPolicy
	 * @param targetAgency
	 * @param importFileName
	 * @param policyPermission
	 * @return
	 */
	public int createDataManagerTask(String agencyCode,String jobName,String targetModule,String taskPolicy,
			String targetAgency,String policyPermission,String sessionId) throws GithubAccessException
	{
		File file = null;
		FileSignal fileStatus = FileProgressHolder.getInstance().getFileStatus();
		String fileScanInterval = WizardHelper.getFromConfiguration("fileScanInterval");
		if(ValidationUtil.isEmpty(fileScanInterval) || ValidationUtil.isEmpty(fileStatus))
		{
			GitFileHandler.downLoadFiles(WizardConstants.STANDARD_BASE_IMPORT_FILE);
		}
		else if(!ValidationUtil.isEmpty(fileStatus) && fileStatus.getStatus().equals(WizardConstants.FILE_DONE))
		{
			file = new File(WizardConstants.STANDARD_BASE_IMPORT_FILE);
		}
		else if(!ValidationUtil.isEmpty(fileStatus) && fileStatus.getStatus().equals(WizardConstants.FILE_FETCHING))
		{
			WizardHelper.waittingFileDone();
			file = new File(WizardConstants.STANDARD_BASE_IMPORT_FILE);
		}
		BatchJobModel batchJobModel = createBatchJob(agencyCode,jobName);
		DataManagerModel managerModel = createDataManagerTaskModel(agencyCode, targetModule, taskPolicy, targetAgency, file.getName(), policyPermission);
		managerModel.setBatchJobModel(batchJobModel);
		try
		{
			DataManagerTaskService managerService = EJBProxy.getDataManagerTaskService();
			managerService.createDataManagerTask(managerModel);
			uploadImportFile(agencyCode,batchJobModel.getJobName(),file.getName(),file,sessionId);
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return 0;
	}
	
	private void uploadImportFile(String agencyCode,String jobName,String fileName,File in,String sessionId)
	{
		WizardHelper.postStream(in,agencyCode,jobName,fileName,sessionId);
	}
	
	/**
	 * 
	 * Create batch job model
	 *
	 * @param agencyCode
	 * @param jobName
	 * @return
	 */
	public BatchJobModel createBatchJob(String agencyCode,String jobName)
	{
		String fullJobName = agencyCode + WizardConstants.SEPARATOR + jobName;
		BatchJobModel jobModel = new BatchJobModel();
		jobModel.setServiceProviderCode(agencyCode);
		AuditModel auditModel = new AuditModel();
		auditModel.setAuditDate(new Date());
		auditModel.setAuditID(WizardConstants.LOGIN_ADMIN);
		auditModel.setAuditStatus("A");
		jobModel.setAuditModel(auditModel);
//		jobModel.setStartTime("01:00 AM");
		jobModel.setFrequency(BatchJobConstants.FREQUENCY_ONCE);
		jobModel.setScheduleType(BatchJobConstants.SCHEDULE_TYPE_NOT_SCHEDULED);
		jobModel.setJobName(fullJobName);
		jobModel.setJobType(WizardConstants.SYS);
		jobModel.setJobStatus(WizardConstants.JOB_STATUS);
		jobModel.setTimeout(new Long(0));
		jobModel.setResId(new Long(0));
		jobModel.setServiceCategory(WizardConstants.DATA_IMPORT);
		return jobModel;
	}
	
	/**
	 * 
	 * Create import information and prepare the data for table RDATA_MANAGER_TASK
	 *
	 * @return
	 */
	public DataManagerModel createDataManagerTaskModel(String agencyCode,String targetModule,String taskPolicy,String targetAgency,String importFileName,String policyPermission)
	{
		DataManagerModel dataManagerModel = new DataManagerModel();
		DataManagerConfigModel configModel = new DataManagerConfigModel();
		configModel.setImportFileName(importFileName);
		configModel.setServiceProviderCode(agencyCode);
		configModel.setTargetModule(targetModule);
		configModel.setPolicyPermission(policyPermission);
		configModel.setTaskPolicy(taskPolicy);
		configModel.setTargetServiceProviderCode(targetAgency);
		dataManagerModel.setConfigModel(configModel);
		return dataManagerModel;
	}

}

/*
*$Log: av-env.bat,v $
*/
