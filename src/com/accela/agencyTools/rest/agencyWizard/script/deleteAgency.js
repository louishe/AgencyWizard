/**
 * delete agency script
 */

var servProvCode = aa.env.getValue("servProvCode");

delateAgecny();

/**
* Main function to delete the agency data while rollback.
*/

function delateAgecny()
{
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var pst = null;
	var rSet = null;
	try
	{
		var sql = "DELETE FROM RSERV_PROV WHERE SERV_PROV_CODE =" + servProvCode;
		pst = conn.prepareStatement(sql);
		
		//remove data from slave table
		UnenableAllSolutions(conn);
		removeInitSeqDef(conn);
		removeInitUserProfile(conn);
		removeInitUser(conn);
		removeInitFee(conn);
		removeStandardChoice(conn);
		removeConstants(conn);
		removeCopyPortlets(conn);
		removeLicense(conn);
		
		//remove data from main table
		rSet = pst.executeUpdate();
		
		
	}finally{
		closeDBQueryObject(pst,conn);
	}
	
}



/**
 * Remove License.
 * @param conn
 * @returns
 */
function removeLicense(conn)
{
	
	var sql2= "DELETE FROM XPLICY WHERE SERV_PROV_CODE = " + servProvCode;
	pst = conn.prepareStatement(sql);
	pst.executeUpdate();
}


/**
 * remove portlet configuration copied from Standard.
 * @param conn
 * @returns
 */
function RemovecopyPortlets(conn)
{
	
	var sql2 = "DELETE　FROM GPORTLET WHERE SERV_PROV_CODE=" +  servProvCode;
	pst = conn.prepareStatement(sql);
	pst.executeUpdate();
}


/**
 * Remove constants SQL.
 * @param conn
 * @returns
 */
function removeConstants(conn)
{
	
	var sql = "DELETE FROM r1server_constant WHERE SERV_PROV_CODE=" + servProvCode;
	//var constantName = new Array("FEEAUDITTRAIL","ACC_CODE_L1","ACC_CODE_L2","ACC_CODE_L3","PRINTPERMITSTYLE","PRINTPERMITSTYLE","PAYBEFOREPRINT","ENABLE_APP_NAME",
	pst = conn.createStatement();
	pst.executeUpdate(sql);
}




/**
 * Remove the default Standard Choice data.
 * @param conn
 * @returns
 */
function removeStandardChoice(conn)
{
	
	var sqlSC = "DELETE FROM RBIZDOMAIN WHERE SERV_PROV_CODE=" + servProvCode;
	var sqlSCValue = "DELETE FROM RBIZDOMAIN_VALUE WHERE SERV_PROV_CODE=" + servProvCode;
	
	pst = conn.createStatement();
	pst.executeUpdate(sqlSCValue);
	pst.executeUpdate(sqlSC);

	
}

/**
 * Remove inital Fee data
 * @param conn
 * @return
 */

function removeInitFee(conn)
{
	var sql = "DELETE FROM RPAYMENT_PERIOD WHERE SERV_PROV_CODE =" + servProvCode;
	pst = conn.createStatement();
	pst.executeUpdate(sql);
	
}


/**
 * Remove inital User data
 * 
 */

function removeInitUser(conn)
{
	var adminUserSql = "DELETE FROM PUSER WHERE SERV_PROV_CODE =" + servProvCode;
	var G3STAFFSSql = "DELETE FROM G3STAFFS WHERE SERV_PROV_CODE =" + servProvCode;
	
	pst = conn.createStatement();
	pst.executeUpdate(G3STAFFSSql);
	pst.executeUpdate(adminUserSql);
}

/**
 * Remove init User Profile
 * 
 */
function removeInitUserProfile(conn)
{
	var sql = "DELETE FROM PUSER_PROFILE WHERE SERV_PROV_CODE =" + servProvCode;
	pst = conn.createStatement();
	pst.executeUpdate(sql);
}

/**
 * Remove the init Sequence Definition & Sequence Masks Definition.
 */
function removeInitSeqDef(conn)
{
	var seqDefSql = "DELETE FROM AA_SEQ_DEF WHERE SERV_PROV_CODE =" + servProvCode;
	var maskDefSql = "DELETE FROM AA_MASK_DEF WHERE SERV_PROV_CODE =" + servProvCode;
	
	pst = conn.createStatement();
	pst.executeUpdate(seqDefSql);
	pst.executeUpdate(maskDefSql);
}


/**
 * Remove solution data
 */
function UnenableAllSolutions(conn)
{
	
	var ppRovSql = "DELETE FROM PPROV_MENUITEM_MODULE WHERE SERV_PROV_CODE =" + servProvCode;
	var XGroupSql = "DELETE FROM XGROUP_MENUITEM_MODULE WHERE SERV_PROV_CODE =" + servProvCode;
	var puserGroupSql = "DELETE FROM PUSER_GROUP WHERE SERV_PROV_CODE =" + servProvCode;
	var ppRovGroupGroupSql = "DELETE FROM PPROV_GROUP WHERE SERV_PROV_CODE =" + servProvCode;
	
	pst = conn.createStatement();
	pst.executeUpdate(XGroupSql);
	pst.executeUpdate(puserGroupSql);
	pst.executeUpdate(ppRovGroupGroupSql);
	pst.executeUpdate(ppRovSql);
	
}

/**
 * close DB connection
 * @param sStmt
 * @param conn
 */

function closeDBQueryObject(sStmt, conn) {
	try {
			if(sStmt){
				sStmt.close();
				sStmt = null;
				aa.print("Statement is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database prepare statement object." + vError);
	}
	
	try {
			if (conn) {
				conn.close();
				conn = null;
				aa.print("Connection is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database connection." + vError);
	}
}



