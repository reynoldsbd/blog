---
title: "Introduction to the UEFI API"
date: 2018-10-15T19:31:54-07:00
draft: true

customToc:
  overview:
    name: Overview
---

UEFI is now the *de-facto* boot environment for x86-64 platforms. It provides a set of modern,
consistent, and feature-rich APIs for building pre-boot software as well as a security mechanisms
to help ensure the integrity of booted systems. This article is a high-level introduction to UEFI
for application developers.
<!--more-->

It's easy to find content about how to configure and manage UEFI-based systems. My personal favorite
introduction to the topic is [Rod Smith's online guides][0.1], followed closely by the
[Arch Wiki entry for UEFI][0.2]. These sources provide solid conceptual and hands-on documentation
for UEFI system administration.

The focus of this article, however, is not to provide guidance on managing a UEFI system. It is to
introduce the concepts and fundamentals of writing applications to run in a UEFI environment. In
particular, I will be discussing the basic data structures and conventions comprising the API using
the [Rust][0.3] programming language and associated tools.


# Overview

First and foremost: UEFI is not a piece of software itself, but a well-specified interface for
interacting with platform firmware. It provides standardized and consistent APIs for a wide variety
of platform features, including console I/O, filesystem access, graphics access, and even
networking. For x86-64 platforms, UEFI replaces BIOS and its associated legacy APIs (such as VGA).

From the application programming perspective, the UEFI API itself is not so difficult to understand.
At startup, applications are provided with a set of function pointers which provide access to
firmware routines. These routines provide services such as memory management and console I/O. The
routines defined in this "system table" form the portion of the UEFI API that all firmwares are
required to implement. However, the specification also defines a number of

TODO


# Base API

All interaction with UEFI firmware starts from the *system table*, which is a strucure that
primarily contains function pointers to basic UEFI services. A pointer to this structure is passed
to the main method of any UEFI program.

Functions made available through the *system table* are subdivided into two categories: *runtime
services* and *boot services*. 


[0.1]: http://www.rodsbooks.com/efi-bootloaders/index.html
[0.2]: https://wiki.archlinux.org/index.php/Unified_Extensible_Firmware_Interface
