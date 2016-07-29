package com.accela.agencyTools.security;

import java.beans.PropertyDescriptor;
import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.accela.aa.exception.AAException;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: SecurityFilter.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: SecurityFilter.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jun 12, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class SecurityFilter implements Filter
{

	public void init(FilterConfig arg0) throws ServletException
	{
		// TODO Auto-generated method stub
		
	}

	public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException,
			ServletException
	{
		HttpServletRequest httpRequest = this.getAsHttpRequest(req);
		HttpServletResponse response = (HttpServletResponse)res;
		response.setContentType("text/html");
		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", -1);
//		if(inValid(httpRequest))
//		{
//			response.sendRedirect("agencyWizard/login.html");
//			response.
//		}
		chain.doFilter(req, res);
	}
	
	/**
	 * 
	 * Check token from request, no token no permission to access.
	 *
	 * @param req
	 * @return
	 */
	private boolean inValid(HttpServletRequest req){
		String authToken = req.getHeader("X-Auth-Token");
		if(authToken == null){
			authToken = req.getParameter("token");
		}
		return (authToken == null) ? true : false;
	}
	
	private HttpServletRequest getAsHttpRequest(ServletRequest request)
	{
		if (!(request instanceof HttpServletRequest)) {
			throw new RuntimeException("Expecting an HTTP request");
		}

		return (HttpServletRequest) request;
	}
	
	public void destroy()
	{
		// TODO Auto-generated method stub
	}

}

/*
*$Log: av-env.bat,v $
*/