package com.accela.agencyTools.rest.agencyWizard.entity;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * <pre>
 * 
 *  Accela Automation
 *  File: StandardBaseModel.java
 * 
 *  Accela, Inc.
 *  Copyright (C): 2016
 * 
 *  Description:
 *  TODO
 * 
 *  Notes:
 * 	$Id: StandardBaseModel.java 72642 2009-01-01 20:01:57Z ACHIEVO\louis.he $ 
 * 
 *  Revision History
 *  &lt;Date&gt;,			&lt;Who&gt;,			&lt;What&gt;
 *  Jul 11, 2016		louis.he		Initial.
 *  
 * </pre>
 */
public class StandardBaseModel extends Entity
{

	private String name;
	
	private String path;
	
	private int size;
	
	private String url;
	
	private String type;
	
	private String sha;
	
	private String html_url;
	
	private String download_url;
	
	private String git_url;
	
	private links _links;

	public links get_links()
	{
		return _links;
	}

	public void set_links(links _links)
	{
		this._links = _links;
	}

	public String getHtml_url()
	{
		return html_url;
	}

	public void setHtml_url(String html_url)
	{
		this.html_url = html_url;
	}

	public String getDownload_url()
	{
		return download_url;
	}

	public void setDownload_url(String download_url)
	{
		this.download_url = download_url;
	}

	public String getGit_url()
	{
		return git_url;
	}

	public void setGit_url(String git_url)
	{
		this.git_url = git_url;
	}

	public String getSha()
	{
		return sha;
	}

	public void setSha(String sha)
	{
		this.sha = sha;
	}

	public String getName()
	{
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getPath()
	{
		return path;
	}

	public void setPath(String path)
	{
		this.path = path;
	}

	public int getSize()
	{
		return size;
	}

	public void setSize(int size)
	{
		this.size = size;
	}

	public String getUrl()
	{
		return url;
	}

	public void setUrl(String url)
	{
		this.url = url;
	}

	public String getType()
	{
		return type;
	}

	public void setType(String type)
	{
		this.type = type;
	}
	
	public static class links
	{
		private String self;
		
		private String git;
		
		private String html;

		public String getSelf()
		{
			return self;
		}

		public void setSelf(String self)
		{
			this.self = self;
		}

		public String getGit()
		{
			return git;
		}

		public void setGit(String git)
		{
			this.git = git;
		}

		public String getHtml()
		{
			return html;
		}

		public void setHtml(String html)
		{
			this.html = html;
		}
	}
	
}

/*
*$Log: av-env.bat,v $
*/