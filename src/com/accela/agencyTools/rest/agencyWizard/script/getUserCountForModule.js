var modules = aa.env.getValue('modules');
var agency = aa.env.getValue('licensingAgency');
getSolutionMapping();
function getSolutionMapping()
{
	
	var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
	var ds = initialContext.lookup("java:/AA");
	var conn = ds.getConnection();
	var pst = null;
	var rSet = null;
	try
	{
		var user_count = 0;
		var buffer = aa.util.newStringBuffer();
		var valList = aa.util.newArrayList();
		var XPOLICY_SQL = "SELECT x.level_data FROM XPOLICY x WHERE x.serv_prov_code = ? AND x.policy_name = 'UserSettings'" +
				" AND x.level_type = 'User' AND x.data1 like '%DUMMYUSER=Y%' AND x.status = 'Y' AND x.rec_status = 'A' " +
				" AND x.level_data != 'ADMIN' AND p.user_name = x.level_data ";
		var MAIN_SQL = "SELECT count(p.user_name) USER_COUNT FROM puser p WHERE p.user_name not like 'PUBLICUSER%' AND p.serv_prov_code = ?" +
		" AND EXISTS (SELECT 1 FROM puser_group g WHERE g.user_name = p.user_name AND g.serv_prov_code = p.serv_prov_code ";
		valList.add(agency);
		
		buffer.append(MAIN_SQL);
		if(modules.size() > 0){
			buffer.append(" AND (");
			for(var i = 0; i < modules.size();i++){
				buffer.append("g.module_name = ?");
				if (i + 1 < modules.length){
					buffer.append(" OR ");
				}else
				{
					buffer.append(')');
				}
				buffer.add(modules.get(i));
			}
		}
		buffer.append(" AND g.rec_status = 'A' )");
		buffer.append(" AND p.user_name <> 'ADMIN' ");
		buffer.append(" AND p.rec_status = 'A' ");
		buffer.append(" AND NOT EXISTS(");
		buffer.append(XPOLICY_SQL);
		buffer.append(")");
		valList.add(agency);
		
		pst = conn.prepareStatement(buffer.toString());
		var solutionModuleMapping = aa.util.newHashMap();
		while (rSet.next()) {
			var solutionName = rSet.getString("solution_name");
			var moduleName = rSet.getString("module_name");
			var moduleList = solutionModuleMapping.get(solutionName);
			if(moduleList==null){
				moduleList = aa.util.newArrayList();
				solutionModuleMapping.put(solutionName, moduleList);
			}
			moduleList.add(moduleName);
		}
		for(var i = 0; i < valList.size();i++){
			pst.setString(i + 1,valList.get(i));
		}
		rSet = pst.executeQuery();
		
		while(rSet.next()){
			user_count = rSet.getString("USER_COUNT");
			break;
		}
		//return user count
		aa.env.setValue('usedUsers',user_count);
	}finally{
		closeDBQueryObject(rSet,pst,conn);
	}
}

function closeDBQueryObject(rSet, sStmt, conn) {                
	try {
			if(rSet) {
				rSet.close();
				rSet = null;
				aa.print("ResultSet is closed normally.");
			}
	} catch(vError) {
			aa.print("Failed to close the database result set object." + vError);
	}
	
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