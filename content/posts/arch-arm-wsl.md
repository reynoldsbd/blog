---
title: "Arch ARM Images in WSL"
date: 2018-09-01T08:55:55-07:00
draft: true
---

Creating a bootable [Arch ARM][arch-arm] image on Windows is possible using the
[Windows Subsystem for Linux][wsl], but it requires a modified approach due to some of the
subsystem's unique limitations. This article walks through the creation of such an image.
<!--more-->

Arch ARM's [official instructions][arch-arm-install] require physically formatting and mounting an
SD card. Unfortunately, WSL does not support [block device access][wsl-no-block] or
[mounting arbitrary media][wsl-no-mount], so those instructions cannot be followed directly.
However, even without those features it's possible to build a raw disk image that can be flashed
onto the SD card from Windows. The process requires at least [version 1.43][e2p-1.43] of
[_e2fsprogs_][e2p], which is available on Ubuntu 18.04 or later.

> Although the focus here is to provide steps which work under WSL, this approach should work on any
> sufficiently modern POSIX system with access to the specified version of _e2fsprogs_.

[arch-arm]: https://archlinuxarm.org/
[arch-arm-install]: https://archlinuxarm.org/platforms/armv6/raspberry-pi
[wsl]: https://docs.microsoft.com/en-us/windows/wsl/about
[wsl-no-mount]: https://github.com/Microsoft/WSL/issues/131
[wsl-no-block]: https://github.com/Microsoft/WSL/issues/689
[e2p]: http://e2fsprogs.sourceforge.net/
[e2p-1.43]: http://e2fsprogs.sourceforge.net/e2fsprogs-release.html#1.43

# Disk Image Skeleton

We'll start by creating and partitioning an empty disk image file. The following [_dd_][dd]
invocation will create an empty 3.9 GiB image, which is small enough to fit on a standard 4 GiB SD
card yet large enough for the Arch ARM system.

```bash
dd if=/dev/zero of=./arch-arm.img bs=4096 count=952149
```

Under WSL, [file allocation happens up-front][wsl-file-alloc]. As a result, this command may take a
while to complete.

The next step is to partition this image in a way that the Raspberry Pi understands. We do this
using an interactive [_fdisk_][fdisk] session:

```bash
fdisk arch-arm.img
> n
> p
> 1
>
> +512M
> t
> c
> n
> p
> 2
>
>
> w
```

After running these commands, the disk image will have the following layout (values expressed in
terms of 512-byte blocks):

Partition | Offset    | Size
----------|-----------|----------
1 (boot)  | 2,048     | 1,048,576
2 (root)  | 1,050,624 | 6,566,568

[dd]: https://wiki.archlinux.org/index.php/Dd
[fdisk]: https://linux.die.net/man/8/fdisk
[wsl-file-alloc]: https://github.com/Microsoft/WSL/issues/2626

# Populating the Image

Now that we have the skeleton of a disk image, we must fill its empty partitions with the extracted
system contents. On a real Linux system, we could use a [loopback device][loopback] to format and
mount these partitions. Instead, we will build formatted partition image files and splice them into
our disk image.

[loopback]: https://linux.die.net/man/8/losetup

## Prepare System Files

Start by retrieving an Arch ARM tarball. You may want to revise this URL if you have a newer
Raspberry Pi model. See the [Arch ARM website][arch-arm] for a complete list of available tarballs.

```bash
wget http://os.archlinuxarm.org/os/ArchLinuxARM-rpi-latest.tar.gz
```

Then extract the files into a new directory. This step must be performed as the root user in order
to preserve the ownership and modes of files on the new system.

```bash
mkdir root
sudo tar -xpf ArchLinuxARM-rpi-latest.tar.gz -C root
```

Finally, move the contents of _/boot_ into a separate directory, since these are destined for a
separate partition.

```bash
mkdir boot
sudo mv root/boot/* boot
```

## Create Partition Images

Now that the contents of the boot and root partitions are ready, it's time to create corresponding
partition images. These images must be no larger than the partitions in the overall disk image,
so we'll start by computing the maximum size of each using the table of partition details from
above.

Partition | Size (bytes)
----------|--------------
1 (boot)  | 536,870,912
2 (root)  | 3,362,082,816

Let's start by creating the root partition image. `mkfs.ext4` is used to create ext4 partitions and
images. We control image size by specifying a block size (`-b`) and block count for the new
filesystem, and we can specify the initial contents of the filesystem using `-d` (assuming we have
[version 1.43 or above][e2p-1.43]).

```bash
mkfs.ext4 -b 4096 -d root -L root root.img 820821
```

A quick sanity check shows that _root.img_ is exactly TODO bytes.

We can create the boot partition image in a very similar fashion using `mkfs.fat` and
[`mcopy`][mcopy].

```bash
mkfs.fat -F 32 -n BOOT -C boot.img 524288
mcopy -i boot.img -s boot/* ::
```

[mcopy]: https://www.gnu.org/software/mtools/manual/mtools.html#mcopy

## Splice Disk Image

The final step is to splice these filesystem images into the skeleton disk image. We simply copy
each partition image byte-for-byte into the disk image, starting at the respective partition
offsets (from our partition table above):

```bash
dd if=boot.img of=arch-arm.img bs=512 offset=2048 conv=notrunc
dd if=root.img of=arch-arm.img bs=512 offset=1050624 conv=notrunc
```

Note the use of `conv=notrunc`. This prevents _dd_ from truncating the output file after copying is
complete, which is what we would expect when performing a splice.

# Writing to the SD Card

It's now time to write _arch-arm.img_ to an SD card. On Windows, I like to use [Etcher][etcher].
Everywhere else, [dd][dd] will suffice.

Congrats, you now have a bootable SD card!

[etcher]: https://etcher.io/
