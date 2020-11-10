# 小米笔记本pro安装deepin

## 官网教程

官网有教程，下载驱动，安装即可
https://www.deepin.org/zh/installation/

## 踩坑记

参考[官方wiki](https://wiki.deepin.org/wiki/%E6%98%BE%E5%8D%A1#.E7.AE.80.E4.BB.8B)

### deepin查看显卡

```
lspci |grep -i ‘VGA’ #查看默认集成显卡型号
lspci |grep -i nvidia #查看NVIDIA类型的显卡型号
sudo dmesg | grep -i ‘VGA’ #通过查看开机信息获取显卡信息
```

### 下载驱动
首先进入NVIDIA官网下载Linux的闭源驱动：NVIDIA官网驱动下载
找到对应显卡的驱动，名字和这个类似：NVIDIA-Linux-x86_64-430.50.run 。
为了方便终端输入，个人建议更改文件名为： n.run 。

### 禁用nouveau驱动
1. 如果之前在Linux中安装过NVIDIA驱动的话，请将其全部删除：

在终端执行命令:

```
sudo apt autoremove nvidia
```
因为不少用户在安装Linux中的NVIDIA时，方便用上驱动，直接使用系统显卡驱动管理中的开源驱动，这样就出现了稳定性差，不能完美驱动NVIDIA显卡。比如桌面切换应用卡顿等，deepin用户请在显卡驱动管理中设置成默认Intel显卡驱动。

2. 用dedit修改文件（dedit是deepin自带的文本编辑器，gedit是Ubuntu自带的文本编辑器，如果你vim足够熟练你也可以使用vim）

```
sudo dedit /etc/modprobe.d/blacklist.conf
```
3. 将以下内容复制到文件中

```
blacklist nouveau   
blacklist lbm-nouveau   
options nouveau modeset=0 
alias nouveau off   
alias lbm-nouveau off
```
保存退出

4. 终端执行如下命令:

```
sudo update-initramfs -u
```

5. 重启系统，再次进入系统，可能会发现分辨率异常。(不能保证会出现异常，如果你的分辨率异常就i说明成功禁用nouveau驱动)


### NVIDIA安装过程
1. 进入超级终端：

使用快捷键CTRL+ALT+F2进入超级终端，登录自己的账号。(就是自己deepin下的用户名和密码)
2. 暂时关闭图形界面：

```
sudo service lightdm stop
```

也可以使用这个命令
```
sudo telinit 3
```

3. 给下载好的nvidia驱动文件设置执行权限：
操作命令：

cd 进入当前指定目录
ls 查看目录内的文件和文件夹

注：如果没有改浏览器的下载路径，路径一般是/home/（你的用户名）/Downloads ,
如果这样都不知道的话，那你就先在图形界面找放驱动的文件夹，
然后在该文件夹里面鼠标右键，打开终端，输入 pwd >> 回车，就会显示出驱动的当前目录。

用以上两个命令进入驱动文件的目录，然后输入以下命令：

```
sudo chmod a+x n.run
```
之前赋予文件什么名，这里填的就是什么


4. 驱动安装：
```
sudo sh n.run
```
这个时候会出现一个页面，一系列`yes`，还有一个界面选择`install and cover`，意为安装和覆盖。然后等待几分钟。

进入nvidia显卡驱动安装界面，如果报错x server说明未关闭图形界面。根据提示选择需要的安装，之后重启查看驱动版本

5. 重启系统：

```
sudo reboot
```
这样`NVIDIA`驱动就装好了。

查看驱动：
```
nvidia-smi
```

查看驱动版本：
```
cat /proc/driver/nvidia/version
```

## 软件窗口大额头修改方法

参考[官方issue](https://github.com/linuxdeepin/developer-center/issues/1210)
实现思路是修改系统自带主题的配置文件

首先创建一个文件，有的话可以跳过
```
# 默认的亮色主题
mkdir -p ~/.local/share/deepin/themes/deepin/light
# 深色主题
mkdir -p ~/.local/share/deepin/themes/deepin/dark
```

进入相应目录，创建配置文件
```
cd ~/.local/share/deepin/themes/deepin/light
deepin-editor titlebar.ini
```
填写以下内容并保存退出
```
[Active]
height=24

[Inactive]
height=24
```
其中参数24为标题栏宽度，可以自行修改，确定，保存注销之后生效

我主要是为了修改`vscode`，所以还修改了其它图标，为省事，直接用的其它图标
```
[Active]
height=24
backgroundColor=#2D2D2D
textColor=#C2C2C2
minimizeIcon.normal=:/deepin/themes/deepin/light/icons/minimize_press.svg
maximizeIcon.normal=:/deepin/themes/deepin/light/icons/maximize_press.svg
unmaximizeIcon.normal=:/deepin/themes/deepin/light/icons/unmaximize_press.svg
closeIcon.normal=:/deepin/themes/deepin/light/icons/close_hover.svg

[Inactive]
height=24
backgroundColor=#2D2D2D
textColor=#C2C2C2
minimizeIcon.normal=:/deepin/themes/deepin/light/icons/minimize_press.svg
maximizeIcon.normal=:/deepin/themes/deepin/light/icons/maximize_press.svg
unmaximizeIcon.normal=:/deepin/themes/deepin/light/icons/unmaximize_press.svg
closeIcon.normal=:/deepin/themes/deepin/light/icons/close_hover.svg
```

::: tip
最近看`vscode`，人家有去除大额头的方法：

设置 -> Window -> Title-Bar-Style -> 修改为 custom即可
:::


参考：
- [Linux(Deepin)如何安装NVIDIA显卡驱动（deepin-Linux）](https://blog.csdn.net/RKCHEN01/article/details/104826736/?utm_medium=distribute.pc_relevant.none-task-blog-baidujs-3)
- [Deepin Linux下更新nvidia独显驱动](https://blog.csdn.net/qq_37806908/article/details/94572394)