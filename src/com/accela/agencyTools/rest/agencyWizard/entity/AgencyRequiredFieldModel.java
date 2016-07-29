package com.accela.agencyTools.rest.agencyWizard.entity;

import com.accela.av360.framework.util.CommonUtil;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: AgencyRequiredFieldModel.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: AgencyRequiredFieldModel.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class AgencyRequiredFieldModel extends Entity
{
	
	private String servProvCode;
	
	private String jurisdiction;
	
	private String agencyName;
	
	private String address1;
	
	private String contactLine1;
	
	public AgencyRequiredFieldModel(String servProvCode,String jurisdiction,String agencyName,String address1,String contactLine1)
	{
		this.servProvCode = servProvCode;
		this.jurisdiction = jurisdiction;
		this.agencyName = agencyName;
		this.address1 = address1;
		this.contactLine1 = contactLine1;
	}

	public String getServProvCode()
	{
		return servProvCode;
	}

	public void setServProvCode(String servProvCode)
	{
		this.servProvCode = servProvCode;
	}

	public String getJurisdiction()
	{
		return jurisdiction;
	}

	public void setJurisdiction(String jurisdiction)
	{
		this.jurisdiction = jurisdiction;
	}

	public String getAgencyName()
	{
		return agencyName;
	}

	public void setAgencyName(String agencyName)
	{
		this.agencyName = agencyName;
	}

	public String getAddress1()
	{
		return address1;
	}

	public void setAddress1(String address1)
	{
		this.address1 = address1;
	}

	public String getContactLine1()
	{
		return contactLine1;
	}

	public void setContactLine1(String contactLine1)
	{
		this.contactLine1 = contactLine1;
	}
	
	public boolean validate(){
		if(CommonUtil.isEmpty(this.servProvCode) || CommonUtil.isEmpty(this.jurisdiction) 
				||CommonUtil.isEmpty(this.address1) || CommonUtil.isEmpty(this.contactLine1)
				||CommonUtil.isEmpty(this.agencyName))
		{
			return false;
		}
		return true;
	}

}

/*
*$Log: av-env.bat,v $
*/