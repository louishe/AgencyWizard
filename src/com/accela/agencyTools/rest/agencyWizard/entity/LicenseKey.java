package com.accela.agencyTools.rest.agencyWizard.entity;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: LicenseKey.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description: used to store license key
 *  TODO
 * 
 *  Notes:
 * 	$Id: LicenseKey.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 19, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class LicenseKey extends Entity
{
	
	public LicenseKey(String info)
	{
		this.licenseInfo = info;
	}
	public String licenseInfo;

	public String getLicenseInfo()
	{
		return licenseInfo;
	}

	public void setLicenseInfo(String licenseInfo)
	{
		this.licenseInfo = licenseInfo;
	}

}

/*
*$Log: av-env.bat,v $
*/