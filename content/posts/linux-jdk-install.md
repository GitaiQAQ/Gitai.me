---
title: Uninstall OpenJDK and install Oracle JDK on Linux
date: 2015-07-06
categories:
    - Linux
tags:
    - Linux
    - Java
---

Java is a programming technology originally developed by Sun Microsystems and later acquired by Oracle. Oracle Java is a proprietary implementation for Java that is free to download and use for commercial use, but not to redistribute, therefore it is not included in a officially maintained repository.

<!--more-->

## Uninstall OpenJDK

```
sudo apt-get autoremove openjdk-7-jre
```

Press 'y' and then press enter when prompted to confirm this change. This should also clean up all the additional dependency libraries that were installed with it.

I also found the following command to perform additional clean up:

```
sudo apt-get purge openjdk*
```

If you use the following command:

```
java -version
```
You should no longer see the openjdk-7-jre installed!

## Install Oracle JDK

You will need to know whether you are running a 32 bit or a 64 bit OS:

```
uname -m
```

* x86_64: 64 bit kernel
* i686: 32 bit kernel

### Downloading Oracle Java JDK

Using your web browser, go to the [Oracle Java SE (Standard Edition) ](http://www.oracle.com/technetwork/java/javase/downloads/index.html)website and decide which version you want to install:

* JDK: Java Development Kit. Includes a complete JRE plus tools for developing, debugging, and monitoring Java applications.
* Server JRE: Java Runtime Environment. For deploying Java applications on servers. Includes tools for JVM monitoring and tools commonly required for server applications.


### Installing Oracle JDK

In this section, you will need sudo privileges:

```
sudo su
```

The **/opt** directory is reserved for all the software and add-on packages that are not part of the default installation. Create a directory for your JDK installation:

```
mkdir /opt/jdk
```

and extract java into the **/opt/jdk** directory:

```
tar -zxf jdk-8u92-linux-x64.tar.gz -C /opt/jdk
```

Verify that the file has been extracted into the **/opt/jdk** directory.

```
ls /opt/jdk
```

### Setting Oracle JDK as the default JVM

In our case, the java executable is located under /opt/jdk/jdk1.8.0_92/bin/java . To set it as the default JVM in your machine run:

```
update-alternatives --install /usr/bin/java java /opt/jdk/jdk1.8.0_05/bin/java 100

update-alternatives --install /usr/bin/javac javac /opt/jdk/jdk1.8.0_05/bin/javac 100
```

### Verify your installation

Verify that java has been successfully configured by running:

```
update-alternatives --display java

update-alternatives --display javac
```

The output should look like this:

```
java - auto mode
link currently points to /opt/jdk/jdk1.8.0_05/bin/java
/opt/jdk/jdk1.8.0_05/bin/java - priority 100
Current 'best' version is '/opt/jdk/jdk1.8.0_05/bin/java'.

javac - auto mode
link currently points to /opt/jdk/jdk1.8.0_05/bin/javac
/opt/jdk/jdk1.8.0_05/bin/javac - priority 100
Current 'best' version is '/opt/jdk/jdk1.8.0_05/bin/javac'.
```

Another easy way to check your installation is:

```
$ java -version
java version "1.8.0_92"
Java(TM) SE Runtime Environment (build 1.8.0_92-b14)
Java HotSpot(TM) 64-Bit Server VM (build 25.92-b14, mixed mode)
```

### Set Environment Variable

Shell config files such as **~/.bashrc**, **~/.bash_profile**, and **~/.bash_login** are often suggested for setting environment variables. While this may work on Bash shells for programs started from the shell, variables set in those files are not available by default to programs started from the graphical environment in a desktop session. 

While **/etc/profile** is often suggested for setting environment variables system-wide, it is a configuration file of the base-files package, so it's not appropriate to edit that file directly. Use a file in **/etc/profile**.d instead as shown above. (Files in /etc/profile.d are sourced by **/etc/profile**.)

**/etc/default/locale** is specifically meant for system-wide locale environment variable settings. It's written to by the installer and when you use Language Support to set the language or regional formats system-wide. On a desktop system there is normally no reason to edit this file manually.

The shell config file **/etc/bash.bashrc** is sometimes suggested for setting environment variables system-wide. While this may work on Bash shells for programs started from the shell, variables set in that file are not available by default to programs started from the graphical environment in a desktop session. 

Login to your account and open .bashrc file

```
vi .bashrc
```

Set JAVA_HOME as follows using syntax `export JAVA_HOME=<path-to-java>`. If your path is set to /opt/jdk/jdk1.8.0_92/bin/java, set it as follows:

```
export JAVA_HOME=/opt/jdk/jdk1.8.0_92/bin/java
export PATH=$PATH:/opt/jdk/jdk1.8.0_92/bin
```

Feel free to replace **/opt/jdk/jdk1.8.0_92** as per your setup. Save and close the file. Just logout and login back to see new changes. Alternatively, type the following command to activate the new path settings immediately:

```
source ~/.bashrc
```

Verify new settings:

```
echo $JAVA_HOME
echo $PATH
```

## Refs

1. [How to uninstall OpenJDK?](https://askubuntu.com/questions/335457/how-to-uninstall-openjdk)
2. [How To Manually Install Oracle Java on a Debian or Ubuntu VPS](https://www.digitalocean.com/community/tutorials/how-to-manually-install-oracle-java-on-a-debian-or-ubuntu-vps)
3. [EnvironmentVariables](https://help.ubuntu.com/community/EnvironmentVariables)
