---
title: "Using the Windows Port of OpenSSH"
subtitle: "Part 1: Integrating ssh-agent with WSL"
date: 2019-01-12T19:02:43-08:00
draft: true
---


TODO: do I need this sentence?
[*ssh-agent(1)*][TODO] caches decrypted SSH keys for an extended period (i.e. the length of a user
session) and make them available to [*ssh(1)*][TODO] sessions over a secure IPC channel.

Even though it uses a customized IPC implementation, the Windows port of ssh-agent can be trivially
adapted to work with WSL.

<!--more-->

> TODO: disclaimer?

This post walks through configuring such an adapter, using a simple solution powered
by Rust and Tokio to bridge IPC connections from WSL clients.


# Background: ssh-agent IPC

On Linux (and WSL), ssh-agent is accessed using the Unix socket given by `$SSH_AUTH_SOCK`. While
this socket is usually furnished by the agent itself, any agent process started under WSL can't yet
outlive the last open WSL console window. This restriction leads to a lot of redundant password
entry.

TODO: compare/contrast Unix and Windows IPC implementations
In contrast, the Windows port uses a well-known named pipe as the system-wide IPC channel.


# Proxying Agent IPC with Rust

TODO: introduction/overview

Rust and Tokio are up to the task.

TODO: "tokio-proxy ?" package enables proxying many different connection types. With the help of
some crates published by the Azure IoT team, we can easily

Tokio provides [an example][TODO] that shows how to proxy two different "async streams (TODO:)".


# Installing and Starting at Logon

Install nprox using cargo:

```powershell
cargo install --git https://github.com/reynoldsbd/nprox
```

Then, [create a task][TODO] to start nprox at logon. Be sure to specify a path for the socket that
your user has full read/write access to.

TODO: screenshot of agent proxy "new task" dialog

If you don't want to wait until the next logon, you can start the proxy immediately by clicking
"TODO:".


























The Windows Subsystem for Linux is rapidly becoming a comfortable working environment for my
everyday development, but one thing I really miss is having an SSH key agent.

On a real Linux system, ssh-agent starts with each login session and remains running until logout.
In contrast, because WSL processes cannot be run in the background, any auto-started ssh-agent will
always be killed once all WSL console windows are closed. In practical terms, this means SSH keys
need to be unlocked each time you open a WSL shell. Yuck!

Thanks to recent additions to Windows 10, I was able to build a solution that allows me to use the
native Windows ssh-agent transparently from WSL. This post walks through how the solution works and
how you can set it up yourself.


# SSH Agent IPC

For those unfamiliar with *exactly* what the SSH-agent is: it's a simple program that stores
decrypted private keys in memory. Users need only enter their password once per login, and the agent
stores their private key and uses it for subsequent SSH sessions.

The agent traditionally uses a Unix domain socket as a secure IPC channel for communicating with
ssh and ssh-add. However, because Unix sockets were not available on Windows until TODO, the Windows
port instead uses a named pipe.

Documentation becomes somewhat thin here, but fortunately we can look at the port of ssh-agent on Github
to find out exactly how it works. To successfully interop between the Windows and WSL versions of OpenSSH,
we need answers to these questions:

1. How do I make a connection to the Windows ssh-agent?
2. Once connected, does this named pipe transport use the same IPC protocol as a "traditional" connection?After tracing the program's early execution, we can find the answer to question 1 at the beginning
of the main request/response loop `agent_listen_loop` in the [*agent.c*][1.5] file.

We don't need to trace far to find the answer to question 2. At the beginning of the agent's main
request/response loop. One of the first things the agent does
is create a named pipe for IPC. If we look at the `agent_start` function in [agent.c][1.5], we see
that one of the first things this agent does is open a [named pipe][1.4]:

```c
// TODO: snippet of named pipe being opened
```

We can further verify that a named pipe is in use with the [TODO][1.5] tool. If ssh-agent is
installed and running, TODO should produce the following output

```
OUTPUT of TODO tool with openssh-ssh-agent pipe
```



[1.1]: https://github.com/PowerShell/Win32-OpenSSH/wiki/About-Win32-OpenSSH-and-Design-Details#af_unix-domain-sockets
[1.2]: https://github.com/PowerShell/openssh-portable
[1.3]: https://github.com/PowerShell/openssh-portable/tree/latestw_all/contrib/win32/win32compat/ssh-agent
[1.4]: https://github.com/PowerShell/openssh-portable/blob/latestw_all/contrib/win32/win32compat/ssh-agent/agent-main.c
[1.5]: https://github.com/PowerShell/openssh-portable/blob/latestw_all/contrib/win32/win32compat/ssh-agent/agent.c
