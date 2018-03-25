1.项目本身就是spring-boot,可以放到外置的tomcat中直接运行不需要修改
   遇到过问题在tomcat中找不到application.properties问题，采用@Configuration注解就好
   在springboot的application.properties配置文件中server.context-path=/lanjing增加url
   
2.实施证明springboot就可以支持https不需要放到外部tomcat中而且配置更为简单

3.在阿里云的安全组规则中要放开https端口才能通过地址访问
