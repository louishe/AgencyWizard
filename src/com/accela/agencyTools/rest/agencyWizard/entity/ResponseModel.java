package com.accela.agencyTools.rest.agencyWizard.entity;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: ResponseModel.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: ResponseModel.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 14, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class ResponseModel implements Serializable
{

	public boolean isStatus()
	{
		return status;
	}
	
	public ResponseModel(){
		this.status = false;
	}

	public void setStatus(boolean status)
	{
		this.status = status;
	}

	public Entity getObj()
	{
		return obj;
	}

	public void setObj(Entity obj)
	{
		this.obj = obj;
	}
	
	public Map getMap()
	{
		return map;
	}

	public void setMap(Map map)
	{
		this.map = map;
	}
	
	public void addField(String key,Object value)
	{
		this.map.put(key, value);
	}

	private boolean status;
	
	private Entity obj;
	
	private Map<String,Object> map = new HashMap<String,Object>();
	
	public List<String> errorMsgs = new ArrayList<String>();

	public List<String> getErrorMsgs()
	{
		return errorMsgs;
	}

	public void setErrorMsgs(List<String> errorMsgs)
	{
		this.errorMsgs = errorMsgs;
	}
	
	public void addErrorMsg(String msg)
	{
		errorMsgs.add(msg);
	}

}

/*
*$Log: av-env.bat,v $
*/