package com.accela.agencyTools.rest.agencyWizard.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonView;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: User.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: User.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 13, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class UserToken extends Entity
{	
	private String usreId;
	
	private String sessionId;

	public String getSessionId()
	{
		return sessionId;
	}

	public void setSessionId(String sessionId)
	{
		this.sessionId = sessionId;
	}
	
	public String getUserId()
	{
		return usreId;
	}

	public void setUserId(String usreId)
	{
		this.usreId = usreId;
	}
	
	@Override
	public String toString()
	{
		// TODO Auto-generated method stub
		return String.format("Login User[%s, %s]", this.usreId,this.sessionId);
	}
	
}

/*
*$Log: av-env.bat,v $
*/