package com.accela.agencyTools.rest.agencyWizard.task;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: FileProgressHolder.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: FileProgressHolder.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 15, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class FileProgressHolder
{
	
	private FileSignal fileStatus;

	private static class Holder
	{
		final static FileProgressHolder instance = new FileProgressHolder();
	}
	
	public static FileProgressHolder getInstance()
	{
		return Holder.instance;
	}
	
	public FileSignal getFileStatus()
	{
		return fileStatus;
	}

	public void setFileStatus(FileSignal fileStatus)
	{
		this.fileStatus = fileStatus;
	}
	
}

/*
*$Log: av-env.bat,v $
*/