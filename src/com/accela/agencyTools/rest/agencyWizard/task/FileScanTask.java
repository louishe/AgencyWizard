package com.accela.agencyTools.rest.agencyWizard.task;

import java.util.ArrayList;
import java.util.List;

import com.accela.aa.util.ValidationUtil;
import com.accela.agencyTools.WizardConstants;
import com.accela.agencyTools.exceptions.GithubAccessException;
import com.accela.agencyTools.rest.agencyWizard.entity.StandardBaseModel;
import com.accela.agencyTools.util.GitFileHandler;
import com.accela.agencyTools.util.WizardHelper;
import com.accela.util.AVLogger;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: FileScanTask.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: FileScanTask.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class FileScanTask implements Runnable
{
	
	private static List<StandardBaseModel> list = new ArrayList<StandardBaseModel>();
	
	/**
	 * 1. Server start, then download files and cache the standardbasemodels
	 * 2.Check file and file sha, if file in tmp folder is deleted, or file on git hub has been updated, then download new files, otherwise 
	 */
	public void run()
	{
		try
		{
			List<StandardBaseModel> standardModelList = GitFileHandler.getGitFileModels();
			
			if(ValidationUtil.isEmpty(list) || GitFileHandler.isAvailable(WizardConstants.STANDARD_BASE_IMPORT_FILE) || GitFileHandler.checkFileSha(standardModelList,list))
			{
				downloadFiles(standardModelList); 
			}
		}
		catch(Exception e)
		{
			if(e instanceof GithubAccessException)
			{
				throw new GithubAccessException("Can't to connect to GitHub!!!");
			}
		}
	}
	
	private void downloadFiles(List<StandardBaseModel> standardModelList) throws GithubAccessException
	{
		FileProgressHolder.getInstance().setFileStatus(FileSignal.Fetching);
		list = standardModelList;
		GitFileHandler.downLoadFiles(WizardConstants.STANDARD_BASE_IMPORT_FILE);
		FileProgressHolder.getInstance().setFileStatus(FileSignal.Done);
	}
	
}

/*
*$Log: av-env.bat,v $
*/