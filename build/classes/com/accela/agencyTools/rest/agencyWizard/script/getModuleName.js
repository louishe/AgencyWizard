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
		var sql = "SELECT amo.module_name, amo.solution_name FROM aaversion_module amo, aaversion av WHERE amo.aa_version_nbr = av.aa_version_nbr and amo.rec_status='A'";
		pst = conn.prepareStatement(sql);
		rSet = pst.executeQuery();
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
		//return js value to java
		aa.env.setValue('rtSolutionMapping',solutionModuleMapping);
//		var solutionModuleMapping = aa.util.newHashMap();
//		var ite = tmpSolutionModuleMapping.keySet().iterator();
//		while(ite.hasNext()){
//			var solution = ite.next();
//			var modules = tmpSolutionModuleMapping.get(solution);
//		}
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