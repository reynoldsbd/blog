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
2. Once connected, does this named pipe transport use the same IPC protocol as a "traditional" connection?
