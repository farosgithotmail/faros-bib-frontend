FROM frolvlad/alpine-oraclejdk8:slim
EXPOSE 8081
VOLUME /tmp
ADD /target/bib.frontend-1.0-SNAPSHOT.jar /bib.frontend-1.0-SNAPSHOT.jar
RUN sh -c 'touch /bib.frontend-1.0-SNAPSHOT.jar'
ENV JAVA_OPTS=""
ENTRYPOINT [ "sh", "-c", "java $JAVA_OPTS -Djava.security.egd=file:/dev/./urandom -jar /bib.frontend-1.0-SNAPSHOT.jar" ]