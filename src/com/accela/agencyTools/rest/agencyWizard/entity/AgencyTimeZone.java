package com.accela.agencyTools.rest.agencyWizard.entity;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: AgencyTimeZone.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: AgencyTimeZone.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 20, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class AgencyTimeZone extends Entity
{

	public String id;
	
	public String displayName;
	
	public AgencyTimeZone(String id,String displayName)
	{
		this.id = id;
		this.displayName = displayName;
	}

	public String getId()
	{
		return id;
	}

	public void setId(String id)
	{
		this.id = id;
	}
	
	public String getDisplayName()
	{
		return displayName;
	}

	public void setDisplayName(String displayName)
	{
		this.displayName = displayName;
	}
}

/*
*$Log: av-env.bat,v $
*/