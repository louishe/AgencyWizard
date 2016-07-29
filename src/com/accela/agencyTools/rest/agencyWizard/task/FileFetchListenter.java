package com.accela.agencyTools.rest.agencyWizard.task;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.accela.util.AVLogger;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: FileFetch.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: FileFetch.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class FileFetchListenter implements ServletContextListener
{
	
	public void contextDestroyed(ServletContextEvent event)
	{
		FileScanSchedule.getInstance().salfClose();
	}

	public void contextInitialized(ServletContextEvent event)
	{
		FileScanSchedule.getInstance().scanStart();
	}

}

/*
*$Log: av-env.bat,v $
*/