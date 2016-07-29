package com.accela.agencyTools.rest.agencyWizard.task;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import com.accela.aa.util.ValidationUtil;
import com.accela.agencyTools.util.WizardHelper;
import com.accela.util.AVProperties;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: FileScanSchedule.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  Scan github every 6 hours
 * 
 *  Notes:
 * 	$Id: FileScanSchedule.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class FileScanSchedule
{
	
	private static final String FILE_INTERVAL = WizardHelper.getFromConfiguration("fileScanInterval");

	private ScheduledExecutorService scheduler;
	
	private long period = 60L * 1000L;
	
	private static class Holder
	{
		final static FileScanSchedule instance = new FileScanSchedule();
	}
	
	public static FileScanSchedule getInstance()
	{
		return Holder.instance;
	}
	
	public void scanStart()
	{
		scheduler = Executors.newSingleThreadScheduledExecutor();
		if(!ValidationUtil.isEmpty(FILE_INTERVAL))
		{
			scheduler.scheduleAtFixedRate(new FileScanTask(), 0, period * Long.parseLong(FILE_INTERVAL), TimeUnit.MILLISECONDS);
		}
	}
	
	public void salfClose()
	{
		if(null != scheduler)
		{
			scheduler.shutdown();
			try{
                if (!scheduler.awaitTermination(5, TimeUnit.SECONDS)) {
                	scheduler.shutdownNow();
                }
            }catch(InterruptedException ex){
                //ignore the ex
            }
		}
	}

}

/*
*$Log: av-env.bat,v $
*/