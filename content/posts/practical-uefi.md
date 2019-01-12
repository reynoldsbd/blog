---
title: "UEFI: A Practical Introduction"
date: 2018-10-27T00:00:00Z
draft: true

customToc:
  overview:
    name: "Overview"
---

In the firmware world, UEFI is no longer the new kid on the block. TODO: more info on proliferation
of platforms now supporting UEFI.

Despite this ubiquity, it's still hard to find material on *how* to write programs to run in a UEFI
environment. The purpose of this article is to provide a practical introduction to the UEFI API,
culminating with the creation of a working application.
<!--more-->

This article uses Rust as a means for introducing and working with UEFI. You might find it useful to
read up on some advanced Rust concepts like memory safety and FFI.


# Overview

The UEFI standard defines a software contract between firmware vendors and OS developers. The span
of this contract is quite broad, but at a high level it boils down to two key features:

1. Applications take the form of simple PE/COFF executables, and the firmware manages loading them
  from disk and setting up a stack.
2. A vast amount of hardware functionality is exposed via a set of platform- and
  architecture-agnostic APIs.

It might not seem like much, but in comparison with alternative firmware interfaces, these features
make writing software for a UEFI-compliant system is much simpler. The barrier to entry for building
and booting a UEFI application is actually quite low, mainly becuase it does not require a single
line of assembly.

UEFI firmware has two modes of operation: with and without *boot services*. When boot services are
active, the platform firmware itself "owns" the system, including its CPU configuration, memory map,
and all hardware, and access to all of these must use the high-level APIs provided by UEFI. When
boot services 
