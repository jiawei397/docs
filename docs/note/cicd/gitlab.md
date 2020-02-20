# 持续集成之.gitlab-ci.yml篇

[[toc]]

在介绍.gitlab-ci.yml之前，我们先看几个概念：

## GitLab Runner

一般来说，构建任务都会占用很多的系统资源 (譬如编译代码)，而 `GitLab CI` 又是 `GitLab `的一部分，如果由 `GitLab CI` 来运行构建任务的话，在执行构建任务的时候，`GitLab` 的性能会大幅下降。

`GitLab CI` 最大的作用是管理各个项目的构建状态，因此，运行构建任务这种浪费资源的事情就交给 `GitLab Runner` 来做啦。因为 `GitLab Runner` 可以安装到不同的机器上，所以在构建任务运行期间并不会影响到 `GitLab` 的性能。

`GitLab Runner`的安装特别简单，官网有各平台的安装方法或安装包，此处不再赘述。

### 注册

- 打开`GitLab` 中的项目页面，在项目设置中找到 `runners`

- 在`runner`运行的机器上，用命令行注册，比如：

``` shell
gitlab-runner register --name="XX"  --url="https://git.xx.com/" --token="XXX" --executor="shell"
```

按照提示一步一步安装就可以了。其中，`executor`可以是多种类型，简单的话可以选`shell`。有熟悉`docker`的可以使用`docker`。

-  配置文件在`/etc/gitlab-runner/config.toml`

	配置项类似下面，可能需要手动添加`builds_dir`和`cache_dir`这两个变量，再重启服务

```
[[runners]]
name = "216XX"
url = "https://git.XX.com/"
token = "XX"
executor = "shell"
builds_dir = "/home/gitlab-runner/builds"
cache_dir = "/home/gitlab-runner/cache"
[runners.cache]
```
### 常见命令

``` shell
sudo gitlab-runner list # 查看各个 Runner 的状态
sudo gitlab-runner stop # 停止服务
sudo gitlab-runner start # 启动服务
sudo gitlab-runner restart # 重启服务
```


## Stages

`Stages` 表示构建阶段，说白了就是上面提到的流程。默认有3个`stages`：`build`, `test`, `deploy`。我们可以在一次 `Pipeline` 中定义多个 `Stages`，这些 `Stages` 会有以下特点：

1. 所有 `Stages` 会按照顺序运行，即当一个 `Stage` 完成后，下一个 `Stage `才会开始
2. 只有当所有 `Stages` 完成后，该构建任务 (Pipeline) 才会成功
3. 如果任何一个 `Stage `失败，那么后面的` Stages `不会执行，该构建任务 (Pipeline) 失败

## Jobs
`Jobs` 表示构建工作，表示某个 `Stage` 里面执行的工作。我们可以在 `Stages` 里面定义多个 `Jobs`，这些 Jobs 会有以下特点：

1、相同 `Stage` 中的 `Jobs` 会并行执行

2、相同 `Stage` 中的 `Jobs` 都执行成功时，该 `Stage` 才会成功

3、如果任何一个 `Job` 失败，那么该 `Stage` 失败，即该构建任务 (Pipeline) 失败


## .gitlab-ci.yml
`.gitlab-ci.yml` 用来配置 `CI` 用你的项目中做哪些操作，这个文件位于仓库的根目录。

当有新内容`push`到仓库，或者有代码合并后，`GitLab`会查找是否有`.gitlab-ci.yml`文件，如果文件存在，`Runners`将会根据该文件的内容开始`build`本次`commit`。

`.gitlab-ci.yml` 使用`YAML`语法， 你需要格外注意缩进格式，要用空格来缩进，不能用`tabs`来缩进。

### 约束
任务中必须得有`script`部分。

### 示例

``` yml
# 定义 stages（阶段）。任务将按此顺序执行。
stages:
  - build
  - test
  - deploy

# 定义 job（任务）
job1:
  stage: test
  tags:
  - XX #只有标签为XX的runner才会执行这个任务
  only:
    - dev	#只有dev分支提交代码才会执行这个任务。也可以是分支名称或触发器名称
    - /^future-.*$/ #正则表达式，只有future-开头的分支才会执行
  script:
    - echo "I am job1"
    - echo "I am in test stage"

# 定义 job
job2:
  stage: test	#如果此处没有定义stage，其默认也是test
  only:
    - master	#只有master分支提交代码才会执行这个任务
  script:
    - echo "I am job2"
    - echo "I am in test stage"
  allow_failure: true #允许失败，即不影响下步构建

# 定义 job
job3:
  stage: build
  except:
  - dev #除了dev分支，其它分支提交代码都会执行这个任务
  script:
    - echo "I am job3"
    - echo "I am in build stage"
  when: always #不管前面几步成功与否，永远会执行这一步。它有几个值：on_success （默认值）\on_failure\always\manual（手动执行）

# 定义 job
.job4:	#对于临时不想执行的job，可以选择在前面加个"."，这样就会跳过此步任务，否则你除了要注释掉这个jobj外，还需要注释上面为deploy的stage
  stage: deploy
  script:
    - echo "I am job4"

# 模板，相当于公用函数，有重复任务时很有用
.job_template: &job_definition  # 创建一个锚，'job_definition'
  image: ruby:2.1
  services:
    - postgres
    - redis

test1:
  <<: *job_definition           # 利用锚'job_definition'来合并
  script:
    - test1 project

test2:
  <<: *job_definition           # 利用锚'job_definition'来合并
  script:
    - test2 project

#下面几个都相当于全局变量，都可以添加到具体job中，这时会被子job的覆盖

before_script:
  - echo "每个job之前都会执行"

after_script:
  - echo "每个job之后都会执行"

variables:	#变量
  DATABASE_URL: "postgres://postgres@postgres/my_database"  #在job中可以用${DATABASE_URL}来使用这个变量。常用的预定义变量有CI_COMMIT_REF_NAME（项目所在的分支或标签名称），CI_JOB_NAME（任务名称），CI_JOB_STAGE（任务阶段）
  GIT_STRATEGY: "none" #GIT策略，定义拉取代码的方式，有3种：clone/fetch/none，默认为clone，速度最慢，每步job都会重新clone一次代码。我们一般将它设置为none，在具体任务里设置为fetch就可以满足需求，毕竟不是每步都需要新代码，那也不符合我们测试的流程

cache:	#缓存
  #因为缓存为不同管道和任务间共享，可能会覆盖，所以有时需要设置key
  key: ${CI_COMMIT_REF_NAME}  # 启用每分支缓存。
  #key: "$CI_JOB_NAME/$CI_COMMIT_REF_NAME" # 启用每个任务和每个分支缓存。需要注意的是，如果是在windows中运行这个脚本，需要把$换成%
  untracked: true	#缓存所有Git未跟踪的文件
  paths:	#以下2个文件夹会被缓存起来，下次构建会解压出来
    - node_modules/
    - dist/
```
### 验证gitlab-ci.yml

```
https://git.xx.com/ci/lint
```
### 跳过job

如果你的`commit`信息包涵`[ci skip]`或者`[skip ci]`，不论大小写，这个`commit`将会被创建，但是`job`会被跳过


### shell问题
使用`shell`脚本时，每步`job`一开始总有不短的等待时间，对于我们而言是不必要的，除去后台`jenkins_build`这步外，仍要最快`20`分钟。

之前，我曾在`release`分支时，暂时将各步整合到一个`job`里，时间缩短为`5`分钟。当然，这是不符合语义的。

最近，发现`docker`没有这个问题。所以，建议使用`docker`。

### 使用docker
#### 示例
以下是我们项目中使用的`.gitlab-ci.yml`文件:

``` yml
image: xx:1.0

stages:
  - jenkins_build
  - install
  - test
  - build
  - e2e
  - zip
  - copy
  - end

cache:
    policy: pull
    key: "$CI_COMMIT_REF_NAME"
    paths:
        - node_modules/
        - .eslintcache

variables:
  DOCKER_DRIVER: overlay2
  GIT_STRATEGY: "fetch"

.template: &templateDef  # 创建一个锚，'template'
  only:
      - master
      - release
      - dev

install:
  stage: install
  <<: *templateDef           # 利用锚'templateDef'来合并
  cache:
      key: "$CI_COMMIT_REF_NAME"
      paths:
          - node_modules
  script:
    - cnpm i

eslint:
  stage: test
  <<: *templateDef
  script:
    - npm run eslint

unit:
  stage: test
  <<: *templateDef
  script:
    - npm run unit

build:
  stage: build
  <<: *templateDef
  only:
      - release
  script:
    - npm run clear_dist
    - npm run build

.e2e_ci:
  stage: e2e
  <<: *templateDef
  script:
    - npm run e2e_ci

zip:
  stage: zip
  <<: *templateDef
  only:
      - release
  script:
    - npm run zip

## Jenkins 复制
jenkins_copyweb:
  stage: copy
  <<: *templateDef
  only:
      - release
  script:
    - ssh $JENKINS_SERVER_IP /jenkins/XX_copyweb.sh

## Jenkins 提交
jenkins_commit:
  stage: end
  <<: *templateDef
  only:
      - release
  script:
    - ssh $JENKINS_SERVER_IP /jenkins/XX_svn_commit.sh

## Jenkins 构建
jenkins_build:
  stage: jenkins_build
  <<: *templateDef
  only:
      - master
  script:
     - ssh $JENKINS_SERVER_IP /jenkins/build.sh
```
其中，`XX:1.0`是我们自己创建的`docker`镜像，它主要安装了`nodejs`、`cnpm`、`jdk`、`sshpass`，其中`sshpass`不是必须的，它是使用密码登陆宿主机时的一种方案。

现在，我们使用`ssh`来与宿主机交互，需要将容器内生成的`ssh`的`key`（`ssh-keygen -t rsa`），即`/root/.ssh/id_rsa.pub`中内容，复制到宿主机的`/root/.ssh/authorized_keys`文件中。

#### 配置
配置文件`/etc/gitlab-runner/config.toml`修改为

``` shell
[[runners]]
  name = "216xx"
  url = "https://git.xx.com/"
  token = "xx"
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "xx:1.0"
    privileged = false
    disable_cache = false
    pull_policy = "if-not-present"
    volumes = ["/cache","/tmp:/tmp:rw"]
    shm_size = 0
  [runners.cache]
```
其中，`pull_policy`是下载`docker`镜像`image`的策略，默认会先从网上找，没有就报错，我们改为先从本地找；`volumes`是将`docker`中的数据卷挂载到宿主机上。
