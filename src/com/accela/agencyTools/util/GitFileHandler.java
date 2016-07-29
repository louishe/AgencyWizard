package com.accela.agencyTools.util;

import java.io.File;
import java.util.List;

import com.accela.aa.util.ValidationUtil;
import com.accela.agencyTools.exceptions.GithubAccessException;
import com.accela.agencyTools.rest.agencyWizard.entity.StandardBaseModel;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: GitFileCompare.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: GitFileCompare.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 19, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class GitFileHandler
{
	
	public static List<StandardBaseModel> getGitFileModels(String url) throws GithubAccessException
	{
		List<StandardBaseModel> modelList = WizardHelper.getRefStandardBaseData(url);
		return modelList;
	}
	
	public static List<StandardBaseModel> getGitFileModels() throws GithubAccessException
	{
		List<StandardBaseModel> modelList = WizardHelper.getRefStandardBaseData(null);
		return modelList;
	}
	
	public static void downLoadFiles(String url,String fileName) throws GithubAccessException
	{
		WizardHelper.getCompressedFile(url, fileName);
	}
	
	public static void downLoadFiles(String fileName) throws GithubAccessException
	{
		WizardHelper.getCompressedFile(null,fileName);
	}
	
	/**
	 * 
	 * Compare stored Standard Base Model with Github.
	 *
	 * @return
	 */
	public static boolean checkFileSha(List<StandardBaseModel> newFiles, List<StandardBaseModel> oldFiles)
	{
		boolean fileChanged = false;
		if (!ValidationUtil.isEmpty(newFiles))
		{
			for (int i = 0; i < oldFiles.size(); i++)
			{
				StandardBaseModel baseModel = oldFiles.get(i);
				String name = baseModel.getName();
				for (StandardBaseModel standardModel : newFiles)
				{
					String tempName = standardModel.getName();
					if (name.equals(tempName))
					{
						if (!baseModel.getSha().equals(standardModel.getSha()))
						{
							fileChanged = true;
							return fileChanged;
						}
					}
				}
			}
		}
		return fileChanged;
	}
	
	/**
	 * 
	 * Check if the file exists or file can be read.
	 *
	 * @param fileName
	 * @return
	 */
	public static boolean isAvailable(String fileName)
	{
		File file = new File(fileName);
		if(!file.exists() || !file.canRead())
		{
			return true;
		}
		return false;
	}

}

/*
*$Log: av-env.bat,v $
*/