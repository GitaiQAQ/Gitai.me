---

layout:     post
title:      "ChomeOS 的 GUI"
date:       2017-03-18
author:     "Gitai"
categories:
    - ChomeOS
tags:
    - ChomeOS

---

> Google声明至2009年底，“Chrome OS”将以“Chromium OS”之名采用开放源代码。虽然“Chrome OS”植基于Linux内核，不过它会使用“一种新的系统”而不会采行目前正在使用中的Linux标准视窗系统，比如X窗口系统。 [^wiki-chromeos]

[^wiki-chromeos]: [Chrome OS - 维基百科](https://zh.wikipedia.org/wiki/Chrome_OS)

<!--more-->

----

> With this week's release of Chrome OS M41, there is the new Freon graphics stack to replace X11 on some platforms. Freon is a very limited graphics stack to replace Chrome OS usage of X11/X.Org by having the Chrome browser communicate directly with the Linux kernel's KMS/DRM API and OpenGL ES interfaces for drawing. This design is much simpler and yields various power and performance improvements though it's not based on Wayland nor Mir (though Chrome plans to support these display server models). [^slashdot]

### Graphics Overview [^Arcpp-Graphics]
![](https://www.diigo.com/file/image/ssdarodzdrqeeqddczcradpqca/chromeos+graphics+overview.jpg)

[^slashdot]: [Google Introduces Freon, a Replacement For X11 On Chrome OS](https://tech.slashdot.org/story/15/03/09/0220205/google-introduces-freon-a-replacement-for-x11-on-chrome-os)

[^Arcpp-Graphics]: [Arcpp Graphics](https://www.x.org/wiki/Events/XDC2016/Program/Arcpp_Graphics.pdf)

#### Hardware-accelerated Canvas API
* OpenGL ES 2.0 since Android 4.0
    * OpenGL ES (GLES) directly
* Everything is rendered onto a "surface."
    * Producer side of a buffer queue that is consumed by SurfaceFlinger
    * The Gralloc HAL is used to allocate buffers for each buffer queue
* ARC++
    * Gralloc and the GLES driver are using the Direct Rendering Manager (DRM)
    * Apps still have access to a fully accelerated GLES implementation
    * Apps using a different rendering API works too

----

> mus+ash (pronounced "mustash") is a project to separate the window management and shell functionality of ash from the chrome browser process. The benefit is performance isolation for system components outside of the browser, and a sharper line between what components are considered part of the ChromeOS UX and what are part of the browser. mus+ash is built on top of the external Mojo shell built from src/mojo/runner and the Mandoline UI Service ("Mus").[^mus+ash-1][^mus+ash-2]

[^mus+ash-1]: [For Developers‎ > ‎mus+ash](https://www.chromium.org/developers/mus-ash)

[^mus+ash-2]: [chromium/chromium/src/lkgr/./ash/mus](https://chromium.googlesource.com/chromium/src/+/lkgr/ash/mus/)

----

![lightdm-login-chromiumos_1.0_amd64][1]
To install Aura run:
```
wget https://github.com/downloads/dz0ny/lightdm-login-chromeos/lightdm-login-chromiumos_1.0_amd64.deb
```
Then:
```
sudo dpkg -i lightdm-login-chromiumos_1.0_amd64.deb
```

You can run it standalone mode from the login screen or in windowed mode within Ubuntu using `chromeos`.

**For more information: [ChromeOS Ubuntu -Github](https://github.com/dz0ny/lightdm-login-chromeos)**[^lightdm-login-chromeos]

[1]: https://i.stack.imgur.com/peRpm.jpg

[^lightdm-login-chromeos]: [Is it possible to use Ash window manager from Chrome OS?](http://askubuntu.com/questions/190362/is-it-possible-to-use-ash-window-manager-from-chrome-os)

----

<iframe width="560" height="315" src="https://www.youtube.com/embed/P2MejPYsgNU" frameborder="0" allowfullscreen></iframe>

[deb package](https://www.ubuntuupdates.org/package/google_chrome/stable/main/base/google-chrome-unstable)

```
google-chrome-unstable -open-ash
```

/etc/X11/sessions/chrome.desktop[^chrome-ash-full-screen]
```
[Desktop Entry]
Name=Chrome
Comment=Chrome Browser
Exec=/usr/bin/google-chrome --open-ash --ash-force-desktop --ash-host-window-bounds="1024x600"
TryExec=/usr/bin/google-chrome
Icon=
Type=Application
DesktopNames=Chrome
```
[^chrome-ash-full-screen]: [Chrome Ash full screen](http://askubuntu.com/questions/593499/chrome-ash-full-screen)

----

crouton in a Chromium OS window (xiwi)[^crouton-in-a-Chromium-OS-window]

> `xiwi` (X11 in a Window) works by creating a window in Chrome and channeling a virtual X11 framebuffer over to it. While crouton transfers the framebuffer relatively efficiently, there's no GPU acceleration and a fair bit of overhead, so don't expect games or graphics-heavy desktop environments to perform well. For basic productivity use it works great, though.

```
crouton [options] -t targets
crouton [options] -f backup_tarball
crouton [options] -d -f bootstrap_tarball

Constructs a chroot for running a more standard userspace alongside Chromium OS.

If run with -f, where the tarball is a backup previously made using edit-chroot,
the chroot is restored and relevant scripts installed.

If run with -d, a bootstrap tarball is created to speed up chroot creation in
the future. You can use bootstrap tarballs generated this way by passing them
to -f the next time you create a chroot with the same architecture and release.

crouton must be run as root unless -d is specified AND fakeroot is
installed AND /tmp is mounted exec and dev.

It is highly recommended to run this from a crosh shell (Ctrl+Alt+T), not VT2.

Options:
    -a ARCH     The architecture to prepare a new chroot or bootstrap for.
                Default: autodetected for the current chroot or system.
    -b          Restore crouton scripts in PREFIX/bin, as required by the
                chroots currently installed in PREFIX/chroots.
    -d          Downloads the bootstrap tarball but does not prepare the chroot.
    -e          Encrypt the chroot with ecryptfs using a passphrase.
                If specified twice, prompt to change the encryption passphrase.
    -f TARBALL  The bootstrap or backup tarball to use, or to download to (-d).
                When using an existing tarball, -a and -r are ignored.
    -k KEYFILE  File or directory to store the (encrypted) encryption keys in.
                If unspecified, the keys will be stored in the chroot if doing a
                first encryption, or auto-detected on existing chroots.
    -m MIRROR   Mirror to use for bootstrapping and package installation.
                Default depends on the release chosen.
                Can only be specified during chroot creation and forced updates
                (-u -u). After installation, the mirror can be modified using
                the distribution's recommended way.
    -M MIRROR2  A secondary mirror, often used for security updates.
                Can only be specified alongside -m.
    -n NAME     Name of the chroot. Default is the release name.
                Cannot contain any slash (/).
    -p PREFIX   The root directory in which to install the bin and chroot
                subdirectories and data.
                Default: /usr/local, with /usr/local/chroots linked to
                /mnt/stateful_partition/crouton/chroots.
    -P PROXY    Set an HTTP proxy for the chroot; effectively sets http_proxy.
                Specify an empty string to remove a proxy when updating.
    -r RELEASE  Name of the distribution release. Default: xenial,
                or auto-detected if upgrading a chroot and -n is specified.
                Specify 'help' or 'list' to print out recognized releases.
    -t TARGETS  Comma-separated list of environment targets to install.
                Specify 'help' or 'list' to print out potential targets.
    -T TARGETFILE  Path to a custom target definition file that gets applied to
                the chroot as if it were a target in the crouton bundle.
    -u          If the chroot exists, runs the preparation step again.
                You can use this to install new targets or update old ones.
                Passing this parameter twice will force an update even if the
                specified release does not match the one already installed.
    -V          Prints the version of the installer to stdout.

Be aware that dev mode is inherently insecure, even if you have a strong
password in your chroot! Anyone can simply switch VTs and gain root access
unless you've permanently assigned a Chromium OS root password. Encrypted
chroots require you to set a Chromium OS root password, but are still only as
secure as the passphrases you assign to them.
```

![](https://i.loli.net/2018/04/18/5ad762142bde1.png)

Install & Updata
```
crouton -u -t xiwi
```

Error
```
/usr/local/chroots/xenial does not exist; cannot update.
Valid chroots:
trusty
```
```
crouton -r trusty -u -t xiwi
```

Running full desktops in a window
```
sudo startgnome -X xiwi
```

Running full desktops in a tab
```
sudo startgnome -n chrootname -X xiwi-tab
```

[Running individual applications in windows and tabs](https://github.com/dnschneid/crouton/wiki/crouton-in-a-Chromium-OS-window-(xiwi)#running-individual-applications-in-windows-and-tabs)

[^crouton-in-a-Chromium-OS-window]: [crouton in a Chromium OS window (xiwi)](https://github.com/dnschneid/crouton/wiki/crouton-in-a-Chromium-OS-window-(xiwi))