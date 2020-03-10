---
title: Working with the GD32VF103
date: 2020-03-08
draft: false

sections:
- anchor: background
  title: Background
  sections:
  - anchor: official-documentation
    title: Official Documentation
  - anchor: other-resources
    title: Other Resources
- anchor: firmware-library
  title: Firmware Library
- anchor: rust
  title: Rust
- anchor: flashing
  title: Flashing
  sections:
  - anchor: usb-flashing-with-dfu-util
    title: USB Flashing with dfu-util
  - anchor: serial-flashing-with-stm32flash
    title: Serial Flashing with stm32flash
  - anchor: jtag-flashing-with-openocd
    title: JTAG Flashing with OpenOCD
---


This post serves as a starting point and reference for writing software for the
GD32VF103 MCU from GigaDevice. It contains background information, programming
and flashing guides, and references to official and unofficial sources of
documentation.

<!--more-->


[Polos GD32VF103 Alef Board]: https://www.analoglamb.com/product/polos-gd32v-alef-board-risc-v-mcu-board/
[AnalogLamb]: https://www.analoglamb.com/


# Background

[GigaDevice] is a Chinese company widely known for flash memory and the GD32
series of ARM microcontrollers. It recently introduced a new family of [RISC-V]
based MCUs known as [GD32V], the first model of which is the GD32VF103. Both the
GD32 and GD32V families are quite similar to the popular [STM32] family of MCUs,
with notably higher performance and, in the case of GD32V, as much as [50% more
power efficient].

The GD32VF103 is based on a new RISC-V implementation developed by [Nuclei
System Technology] called the Bumblebee core. This core has some interesting
characteristics such as branch prediction and advanced interrupt handling
hardware, but mostly its focus seems to be on optimized power consumption.

Notably, the GD32VF103 is currently the cheapest available RISC-V MCU on the
market. It is available on the following development boards:

* [Polos Alef] - $1.49
* [Longan Nano] - $4.90
* [Wio Lite RISC-V] - $6.90

In putting together this post, I used a Polos Alef development board. However,
the information on this page should be equally relevant for any board based on
the GD32VF103.

[GigaDevice]: https://en.wikipedia.org/wiki/GigaDevice
[RISC-V]: https://en.wikipedia.org/wiki/RISC-V
[GD32V]: https://www.gigadevice.com/products/microcontrollers/gd32/risc-v/
[STM32]: https://en.wikipedia.org/wiki/STM32
[50% more power efficient]: https://www.gigadevice.com/press-release/gigadevice-unveils-the-gd32v-series-with-risc-v-core-in-a-brand-new-32bit-general-purpose-microcontroller/
[Nuclei System Technology]: https://www.nucleisys.com/
[Polos Alef]: https://www.analoglamb.com/product/polos-gd32v-alef-board-risc-v-mcu-board/
[Longan Nano]: https://www.seeedstudio.com/Sipeed-Longan-Nano-RISC-V-GD32VF103CBT6-Development-Board-p-4205.html
[Wio Lite RISC-V]: https://www.seeedstudio.com/Wio-Lite-RISC-V-GD32VF103-p-4293.html

## Official Documentation

GigaDevice provides datasheets and other technical documentation on a
"microsite" dedicated to GD32 MCUs. Here is a direct link to documentation for
the GD32VF103:

http://www.gd32mcu.com/en/download/0?kw=GD32VF1

The primary source of documentation for working with Nuclei cores (including
Bumblebee) seems to be [this site][riscv-mcu-site], which is not available in
English. However, English translations of *some* of the site's contents are
available [on GitHub][riscv-mcu-site-gh]. Likewise on GitHub are some [Bumblebee
datasheets].

[riscv-mcu-site]: https://www.riscv-mcu.com/
[riscv-mcu-site-gh]: https://github.com/riscv-mcu/Webpages
[Bumblebee datasheets]: https://github.com/nucleisys/Bumblebee_Core_Doc

## Other Resources

* [Longan Nano (GD32VF103)] - Blog post from Kevin Sangeelee recording his
  experimentation with a Longan Nano development board.
* [Rust on the Sipeed Longan Nano, an inexpensive RISC-V dev board] - Blog post
  from Pramode C.E. about running Rust code on a Longan Nano

[Longan Nano (GD32VF103)]: https://www.susa.net/wordpress/2019/10/longan-nano-gd32vf103/
[Rust on the Sipeed Longan Nano, an inexpensive RISC-V dev board]: https://pramode.net/2019/10/07/rust-on-riscv-board-sipeed-longan-nano/


# Firmware Library

For traditional C/C++/ASM development, GigaDevice provides an [open source
firmware library] complete with examples and project templates. The library
includes higher level functions and macros for interfacing with the MCU's
peripherals. It also provides a project template complete with a *Makefile*
demonstrating how to compile and flash firmware.

To use the Makefile included with this library, the [Nuclei RISC-V toolchain]
must be available in your path. Also, at this time, [some modifications] to the
template Makefile are necessary in order to make the project buildable.

[open source firmware library]: https://github.com/riscv-mcu/GD32VF103_Firmware_Library/
[Nuclei RISC-V toolchain]: https://nucleisys.com/download.php
[some modifications]: https://github.com/riscv-mcu/GD32VF103_Firmware_Library/pull/6


# Rust

For those wishing to use Rust: You are in luck! The current stable Rust compiler
has support for producing native RV32IMAC code, and there are several open
source crates available implementing platform initialization and access to the
MCU's peripherals.

To get started, enable the approprate Rust target:

```
rustup target add riscv32imac-unknown-none-elf
```

Create a new Cargo binary project, then add [*riscv-rt*] as a dependency and
follow that crate's instructions to set up your project. The result is a minimal
firmware program that boots but does nothing.

To make the firmware do something interesting, we must use peripherals to
interact with the outside world. We *could* implement our own logic and
abstractions for communicating with these peripherals. However, the Embedded
Rust community has coalesced around the [*embedded-hal*] crate as a common
abstraction layer for accessing microcontroller peripherals, and implementations
of this HAL exist for a great many MCUs, including the GD32VF103.

[*riscv-rt*]: https://crates.io/crates/riscv-rt
[*embedded-hal*]: https://crates.io/crates/embedded-hal

https://github.com/riscv-rust/gd32vf103-pac

https://github.com/riscv-rust/gd32vf103xx-hal


# Flashing

The MCU features a bootloader mode that can be used to load new firmware. To
activate, hold the BOOT button while resetting the device. The bootloader
supports several different mechanisms for flashing, which are detailed in the
following sections.

<!-- todo: is it possible to overwrite the bootloader? -->

## USB Flashing with dfu-util

Using DFU is probably the most convenient way to flash, because it only requires
a single USB cable and works on both Windows and Linux. But there's a catch: the
bootloader technically does not comply with the [DFU specification][dfu-spec],
which means the standard [dfu-util][dfu-util] tool will not work.

Instead, you must use [a customized version][gd32-dfu-utils] with support for
the GD32V bootloader.

[dfu-spec]: https://www.usb.org/sites/default/files/DFU_1.1.pdf
[dfu-util]: http://dfu-util.sourceforge.net/
[gd32-dfu-utils]: https://github.com/riscv-mcu/gd32-dfu-utils

### Windows

<!-- todo: needs validation -->

A prebuilt binary of the customized dfu-util is available for Windows users
under the GitHub Releases section.

As noted on the releases page, Windows users will need to use [Zadig][zadig] to
configure the WinUSB driver.

[zadig]: https://zadig.akeo.ie/

### Other Platforms

Non-Windows users will need to build this tool from source. It's not so hard;
simply follow the instructions in the *INSTALL* file and deal with any missing
dependencies as you go along.

> Hint: On Ubuntu, you'll need to install the following dependency packages:
>
> ```
> build-essential autoconf pkg-config libusb-1.0-0-dev
> ```

<!-- todo: figure out how to use doc/40-dfuse.rules -->

### Usage

Use the following command to flash the MCU. See `dfu-util -h`
for an explanation of these parameters.

```
dfu-util -d 28e9:0189 -a 0 --dfuse-address 0x08000000:leave -D path/to/firmware.bin
```

## Serial Flashing with stm32flash

TODO

https://sourceforge.net/projects/stm32flash/

## JTAG Flashing with OpenOCD

TODO
