package com.accela.agencyTools.exceptions;
/**
 * <pre>
 * 
 *  Accela Automation
 *  File: NetworkAccessException.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: NetworkAccessException.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 23, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class GithubAccessException extends RuntimeException
{
	public GithubAccessException()
	{
		super();
	}
	
	public GithubAccessException(String msg)
	{
		super(msg);
	}
	
	public GithubAccessException(String msg,Throwable cause)
	{
		super(msg,cause);
	}
	
	public GithubAccessException(Throwable cause)
	{
		super(cause);
	}
}

/*
*$Log: av-env.bat,v $
*/