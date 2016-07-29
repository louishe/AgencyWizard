package com.accela.agencyTools.rest.agencyWizard.task;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: FileSignal.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: FileSignal.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 15, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public enum FileSignal
{
	Done("Finished"),
	Fetching("Fetching");
	
	private FileSignal(String status)
	{
		this.status = status;
	}
	
	private String status;
	
	public String getStatus()
	{
		return status;
	}
}

/*
*$Log: av-env.bat,v $
*/