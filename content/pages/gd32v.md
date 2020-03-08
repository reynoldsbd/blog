# Alef Board

This directory contains documentation pertaining to the Polos GD32V Alef Board,
which is a low cost, low power RISC-V MCU development kit. It is available for
purchase [from AnalogLamb][alef-board-analoglamb]:

The MCU around which this dev board is based, the GD32VF103, is also used on
many other development boards available online. Likely most, if not all, of the
information on this page is transferrable to those boards as well. Perhaps one
day I will re-title this document "The GD32V Platform"...

[alef-board-analoglamb]: https://www.analoglamb.com/product/polos-gd32v-alef-board-risc-v-mcu-board/


# Bare-Bones Development

<!-- todo: absolute minimum blinky -->


# Development with Firmware Library

GigaDevice provides an [open source firmware library][gd32vf103-fwlib-gh]
complete with examples and project templates. The library includes high-level
routines for interfacing with peripherals found on the MCU, as well as build
scripts demonstrating how to compile and flash firmware for the device.

To use the Makefile included with this library, the Nuclei RISC-V toolchain must
be available in your path. This toolchain can be downloaded
[here][nuclei-toolchain].

[gd32vf103-fwlib-gh]: https://github.com/riscv-mcu/GD32VF103_Firmware_Library/
[nuclei-toolchain]: https://nucleisys.com/download.php


# Rust

https://github.com/riscv-rust/riscv-rust-quickstart

https://github.com/riscv-rust/gd32vf103-pac

https://github.com/riscv-rust/gd32vf103xx-hal

https://pramode.net/2019/10/07/rust-on-riscv-board-sipeed-longan-nano/


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


# GD32VF103 MCU

The MCU is a GigaDevice GD32VF103 series, which is essentially a RISC-V version
of the GD32 family of MCUs, which in turn are nearly clones of the ubiquitous
STM32 MCUs.

## Documentation

The datasheet, user manual, and firmware library in this directory were all
downloaded from a GigaDevice "microsite" dedicated to GD32 MCUs:

http://www.gd32mcu.com/en/download/0?kw=GD32VF1

In the future, if this microsite becomes unavailable, you may be able to drill
down and find relevant content by starting at GigaDevice home page:

https://www.gigadevice.com/


# Bumblebee Core

The GD32VF103 series is based on the Bumblebee Core, which is a RV32IMAC
implementation co-developed by GigaDevice and Nuclei Systems.

## Documentation

The primary source of documentation for working with Bumblebee Cores seems to be
[this website][riscv-mcu-site], which unfortunately is only available in
Chinese. However, an English version of some of the site's content can be found
[on GitHub][riscv-mcu-site-gh].

The Bumblebee Core manuals in this directory are also available
[on GitHub][bumblebee-doc-gh].

[riscv-mcu-site]: https://www.riscv-mcu.com/
[riscv-mcu-site-gh]: https://github.com/riscv-mcu/Webpages
[bumblebee-doc-gh]: https://github.com/nucleisys/Bumblebee_Core_Doc


# Other Resources

https://www.susa.net/wordpress/2019/10/longan-nano-gd32vf103/
